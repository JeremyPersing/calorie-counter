import React, { Component } from "react";

class Select extends Component {
  render() {
    const { name, label, error, itemsList, value, ...rest } = this.props;

    return (
      <div>
        <div className="form-control-select">
          <select
            id={name}
            name={name}
            // Inline styles because styling selects is a mofo
            style={{
              marginTop: ".5rem",
              marginBottom: ".5rem",
              fontSize: "0.8rem",
              color: "gray",
              width: "100%",
            }}
            {...rest}
          >
            {!value && (
              <option value="" selected disabled defaultValue>
                {label}
              </option>
            )}

            {!value
              ? itemsList.map((g) => (
                  <option key={g._id} value={g.name}>
                    {g.name}
                  </option>
                ))
              : itemsList.map((g) => {
                  if (value === g.name)
                    return (
                      <option key={g._id} value={g.name} selected>
                        {g.name}
                      </option>
                    );

                  return (
                    <option key={g._id} value={g.name}>
                      {g.name}
                    </option>
                  );
                })}
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    );
  }
}

export default Select;
