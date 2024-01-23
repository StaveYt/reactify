function Option(props){
    return(
        <option selected={props.selected} value={props.value}>{props.value}</option>
    )
}
export default Option