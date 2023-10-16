function Input(props){
    return(
        <input type={props.type} className="rounded-sm bg-slate-700 text-white p-1 border border-slate-500" id={props.id} placeholder={props.placeholder} onChange={props.onChange}/>
    )
}

export default Input