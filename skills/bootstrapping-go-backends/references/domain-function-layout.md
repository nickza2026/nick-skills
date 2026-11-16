# Domain function layout and validation

These are explicit rules for every new or changed domain operation in the arpc/pgsql baseline (`<app>/<domain>/<domain>.go`). They come from Nick's reference features (for example a `datacenter` CRUD package and an `audit` list/get package) and apply even when older nearby code is split differently. They do not authorize rewriting unrelated existing operations.

## Rule 1: Params, Valid, and Result sit directly above their operation

Write each operation as one contiguous block, top to bottom:

1. `<Op>Params` struct with camelCase JSON tags (plus nested filter types used only by it).
2. `func (p *<Op>Params) Valid() error`.
3. `<Op>Result` and its item/row types, when the operation returns data.
4. Doc comment and Swagger annotations.
5. `func <Op>(ctx context.Context, p *<Op>Params) (*<Op>Result, error)` or `error` when nothing is returned.

The next operation's block starts after the previous function closes. A row type shared by several operations of the same domain (for example `Row` used by List and Get) lives beside the first operation that uses it. Reuse an existing type when the shape is identical instead of declaring a near-duplicate.

Inside the function keep the readable order: `p.Valid()` → `iam.Authorize(ctx, permission.<Op>)` → query/mutation → audit log when the domain records one → result. Map `sql.ErrNoRows` to the shared not-found code and return typed codes from `pkg/codes`.

## Rule 2: Keep the operation in its domain file

Params, validation, results, and the operation stay in the domain's own `.go` file. Do not move them into `types.go`, `params.go`, `dto.go`, `validate.go`, `helpers.go`, or a new `pkg` package unless another application or domain actually reuses them. A test file, migration, or genuinely separate domain is a valid reason for a new file; appearance or a line count is not.

## Rule 3: Do not split single-use logic into extra functions

Write single-use logic inline in the operation: filter closures, value defaults, audit change lists, and scan targets. Declare a shared predicate as a local closure (`filter := func(b pgstmt.Cond) { ... }`) when both the count query and the page query need it.

Extract a named function only when one of these is true:

- Two or more call sites use it now (for example, `Suspend` delegating to `Update`).
- It is an existing shared helper in the project or `pkg`.
- The user approved the extraction.

Do not create pass-through wrappers, `buildXxxFilter`/`scanXxx`/`toXxxResult` helpers with one caller, interfaces, or repository/service layers for a single operation.

## Rule 4: Ask before adding complexity

When a correct implementation seems to need extra structure, stop and ask the user before writing it. Explain the reason and offer concrete options (use the structured question tool when available), with the simplest option that satisfies the requirement listed first. Triggers include:

- A new file, package, interface, or layer.
- A single-use helper function, or a generic abstraction.
- A transaction spanning several operations, a background job, or a cache.
- A new dependency, or a deviation from the comparable local feature.

Do not ask about routine work that follows these rules. Do not proceed with the complex version silently and explain it afterwards.

## Rule 5: Valid uses only the validator's own methods

`moonrhythm/validator` provides `validator.New()`, `v.Must(cond bool|err error, msg string|error) bool`, `v.Mustf(cond, format, args...)`, `v.Add(errs ...error)` (nil errors are skipped), `v.Valid()`, and `v.Error()`. Every check in `Valid` is one of these calls, and the method always ends with `return v.Error()` so that all failures are collected into one `VALIDATION` response.

Do not hand-write `if` branches that return a custom error or call a local `invalid()` helper. Express optional fields as one boolean condition: "absent, or present and valid."

Rejected:

```go
func (p *ListParams) Valid() error {
	if (p.ServerID != nil && *p.ServerID == uuid.Nil) || (p.UserID != nil && *p.UserID == uuid.Nil) {
		return invalid()
	}
	return nil
}
```

Required:

```go
func (p *ListParams) Valid() error {
	v := validator.New()
	v.Must(p.Paginate != nil, "paginate is required")
	v.Must(p.ServerID == nil || *p.ServerID != uuid.Nil, "serverId is invalid")
	v.Must(p.UserID == nil || *p.UserID != uuid.Nil, "userId is invalid")
	v.Must(p.Filter == nil || p.Filter.Status == "" || p.Filter.Status == StatusSuccess, "filter.status is invalid")
	v.Add(p.Sort.ValidateSort(Row{}))
	return v.Error()
}
```

- Use one `v.Must` per field or rule, with a field-named message such as `"dataCenterId is required"`.
- Use `v.Mustf` when the message needs a value, for example `v.Mustf(len(p.Name) <= 100, "name must be at most %d characters", 100)`.
- Pass helper errors (such as sort validation) through `v.Add(err)` or `v.Must(err, nil)`; the existing `if err := ...; err != nil { v.Add(err) }` form is also acceptable.
- Plain `if` is acceptable only for guarding nested access before `v.Must` calls, for example `if p.Filter != nil { v.Must(...) }`, never to return early.
- Keep `Valid` free of database access and side effects. Existence, ownership, and state checks belong in the operation after authorization.

## Reference shape

```go
type GetParams struct {
	DataCenterID string `json:"dataCenterId"`
}

func (p *GetParams) Valid() error {
	v := validator.New()
	v.Must(p.DataCenterID != "", "dataCenterId is required")
	return v.Error()
}

// Get returns one data center by id.
// @Summary Get data center
// @Tags Datacenter
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body GetParams true "dataCenterId"
// @Success 200 {object} Row
// @Failure 400 {object} admin.APIErrorResponse "NOT_FOUND"
// @Router /datacenter.get [post]
func Get(ctx context.Context, p *GetParams) (*Row, error) {
	if err := p.Valid(); err != nil {
		return nil, err
	}
	if err := iam.Authorize(ctx, permission.DatacenterView); err != nil {
		return nil, err
	}

	var row Row
	err := pgctx.QueryRow(ctx, `
		select id, name, created_at
		from data_centers
		where id = $1 and deleted_at is null`,
		p.DataCenterID,
	).Scan(&row.DataCenterID, &row.Name, &row.CreatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, codes.ErrNotFound
	}
	if err != nil {
		slog.Error("datacenter get failed", "error", err)
		return nil, err
	}
	return &row, nil
}
```

Identifiers such as `iam`, `permission`, and `codes` are the reference project's names. Use the target project's equivalents rather than copying them.
