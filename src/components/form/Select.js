function Select(props){
    return(
        <select id={props.id}disabled={props.disabled} className={"bg-white text-[#464648] p-[2px] " + props.className} onChange={props.onChange}>
            {props.children}
        </select>
    )
}
export default Select