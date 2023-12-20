function ReactionParticipants(props) {
    function handleAddParticipant(event) {
        if(props.type=='reactant'){
            event.target.className += " hidden"
            props.vars.setNReactants(props.vars.nReactants+1);
            props.vars.setReactants([...props.vars.reactants, new Participant('reactant', props.vars.nReactants)]);
        }else if(props.type=='product'){
            event.target.className += " hidden";
            props.vars.setNProducts(props.vars.nProducts + 1);
            props.vars.setProducts([...props.vars.products, new Participant('product', props.vars.nProducts)]);
        }
    }
    function handleDeleteParticipant(event) { //shit aint working
        let participant = event.target.parentNode.parentNode;
        let parentChildren = event.target.parentNode.parentNode.parentNode.children;
        let lastChild = parentChildren[parentChildren.length - 2] === undefined?parentChildren[parentChildren.length - 1]:parentChildren[parentChildren.length - 2] ;
        let lastChildButton = lastChild.children[lastChild.children.length - 1];
        if(props.type=='reactant'){
            props.vars.setReactants((reactants) => reactants.filter(el => el.id !== parseInt(participant.id.split(' ')[0]) ? true : false));
        }else if(props.type=='product'){
            props.vars.setProducts((products) => products.filter(el => el.id !== parseInt(participant.id.split(' ')[0]) ? true : false));
        }
        lastChildButton.className = lastChildButton.className.replace(' hidden', '');
    }
    function Participant(type, id) {
        this.state = 'gas';
        this.element = '';
        this.coefficient = 1;
        this.id = id;
        this.type = type;
    }
    function handleInputChange(event) {
        let input = event.target;
        let participantId = event.target.parentNode.parentNode.id !== 'reactantsContainer' && event.target.parentNode.parentNode.id !== 'productsContainer' ? event.target.parentNode.parentNode.id.split(' ') : event.target.parentNode.id.split(' ');
        let participant;
        let participantTemp
        if(participantId[1]==='reactant'){
            participant = props.vars.reactants.filter(el=>el.id == parseInt(participantId[0])?true:false)[0]
            participantTemp = [...props.vars.reactants]
            
        }else if(participantId[1]==='product'){
            participant = props.vars.products.filter(el=>el.id == parseInt(participantId[0])?true:false)[0]
            participantTemp = [...props.vars.products]
        }
        console.log(participant, parseInt(participantId[0]));

        let participantInd = participantTemp.indexOf(participant)
        switch (input.id) {
            case 'stateInput':
                participant.state = input.value
                break;

            case 'elementInput':
                participant.element = input.value
                break;
            case 'coefficientInput':
                participant.coefficient = input.value
                break;
        }
        participantTemp[participantInd] = participant
        // props.vars.setReactants([...participantTemp]);
    }
    return (
        <div id={props.id} className="border border-rose-600 text-black flex flex-row justify-center">
            <input id='coefficientInput' onClick={handleInputChange} className="w-10" type="number" min={1} />
            <input id='elementInput' onChange={handleInputChange} className="inline-flex" type="text" />
            <div className="flex flex-col  justify-center">
                <button onClick={handleDeleteParticipant} className="flex-1 rounded-sm bg-green-600 text-white border border-green-500">-</button>
                <select onClick={handleInputChange} id='stateInput' className="flex-1">
                    <option>g</option>
                    <option>s</option>
                    <option>l</option>
                    <option>aq</option>
                </select>
            </div>
            <button onClick={handleAddParticipant} className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500">+</button>
        </div>
    )
}
export default ReactionParticipants