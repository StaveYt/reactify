function Table(props){
    return(
        <table className="bg-slate-700 w-full">
        <thead className="border-b-2 border-white">
          {props.columns.map(el=>(
            <th>{el}</th>
          ))}
        </thead>
        <tbody id="tKnown">
          {props.children}
        </tbody>
      </table>
    )
}

export default Table