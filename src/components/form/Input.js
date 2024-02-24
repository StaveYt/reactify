function Input(props){
    return(
        <input min={props.type==="number"?props.min:0} type={props.type} className={"text-[#464648] shadow-[#222] p-1 bg-white [clip-path:inset(0_0px_-10px_-10px)]  shadow-sm rounded-l-sm "+props.className} id={props.id} placeholder={props.placeholder} onChange={props.onChange}/>
    )
}

export default Input