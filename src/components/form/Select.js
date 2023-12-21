function Select(props){
    return(
        <select id={props.id}disabled={props.disabled} className="bg-slate-800 text-white border border-slate-500" onChange={props.onChange}>
            {props.children}
        </select>
    )
}
export default Select