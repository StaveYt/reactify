import Table from "../table/Table";

function ShowTabledData(props) {
  return (
    <Table columns={["Podatak", "Količina", "Mjerna Jedinica"]}>
      {Object.keys(props.calculatedData).map((key, index) => (props.calculatedData[key] != 0 && key != "M" && props.calculatedData[key] != Infinity) ? (
        <tr key={index}>
          <td>
            {key}
          </td>
          <td>
            {props.calculatedData[key].quantity}
          </td>
          <td>
            {props.calculatedData[key].unit}
          </td>
        </tr>
      ) : false)}
    </Table>
  );
}

export default ShowTabledData;