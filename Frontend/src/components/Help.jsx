import styles from './Theater.module.css'
const Help = ({
  inputArr,
  value,
  handleChange,
  handleRemove,
  handleAddRow,
}) => {
  return (
    <div className={styles.items}>
      <fieldset>
        <legend>{value}</legend>
        {inputArr.map((item, index) => (
          <div key={index} className={styles.item_information}>
            {/* Check if the item is an object and has 'name' and 'role' properties */}
            {typeof item === "object" && item !== null ? (
              <>
                <input
                  type="text"
                  name={`${value}-name-${index}`}
                  value={item.name}
                  onChange={(e) =>
                    handleChange(inputArr, index, {
                      ...item,
                      name: e.target.value,
                    })
                  }
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  name={`${value}-role-${index}`}
                  value={item.role}
                  onChange={(e) =>
                    handleChange(inputArr, index, {
                      ...item,
                      role: e.target.value,
                    })
                  }
                  placeholder="Role"
                  required
                />
              </>
            ) : (
              <input
                type="text"
                name={`${value}-${index}`}
                value={item}
                onChange={(e) => handleChange(inputArr, index, e.target.value)}
                required
              />
            )}
            <div className={styles.theater_button}>
              <button
                type="button"
                onClick={() => handleRemove(inputArr, index)}
                style={{ color: "red", fontSize: "1.2rem" }}
              >
                {`Remove ${value}`}
              </button>
            </div>
          </div>
        ))}
        <div className={styles.theater_button}>
          <button type="button" onClick={handleAddRow}>
            {`Add ${value}`}
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default Help;
