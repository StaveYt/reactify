function Table(props){
    return(
        <div className="overflow-x-auto"><table className="bg-[#90909394]  relative overflow-auto  sm:min-w-[470px] min-h-[70px] text-[#FFF] w-full">
        <thead className="border-b-2 border-white">
          {props.columns.map(el=>(
            <th>{el}</th>
          ))}
        </thead>
        <tbody id="tKnown">
          {props.children}
        </tbody>
      </table>
      </div>
    )
}

export default Table