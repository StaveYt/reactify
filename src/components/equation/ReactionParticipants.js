import Input from "../form/Input";
import Option from "../form/Option";
import Select from "../form/Select";

function ReactionParticipants(props) {
  function handleDeleteParticipant(event) { //shit aint working
    let participant = event.target.parentNode.parentNode;
    let parentChildren = event.target.parentNode.parentNode.parentNode.children;
    let lastChild = parentChildren[parentChildren.length - 2] === undefined ? parentChildren[parentChildren.length - 1] : parentChildren[parentChildren.length - 2];
    let lastChildButton = lastChild.children[lastChild.children.length - 1];
    if (props.type == 'reactant') {
      props.vars.setReactants((reactants) => reactants.filter(el => el.id !== parseInt(participant.id.split(' ')[0]) ? true : false));
    } else if (props.type == 'product') {
      props.vars.setProducts((products) => products.filter(el => el.id !== parseInt(participant.id.split(' ')[0]) ? true : false));
    }
    lastChildButton.className = lastChildButton.className.replace(' hidden', '');
  }
  function handleInputChange(event) {
    let input = event.target;
    let participantId = event.target.parentNode.parentNode.id !== 'reactantsContainer' && event.target.parentNode.parentNode.id !== 'productsContainer' ? event.target.parentNode.parentNode.id.split(' ') : event.target.parentNode.id.split(' ');
    let participant;
    let participantTemp;
    if (participantId[1] === 'reactant') {
      participant = props.vars.reactants.filter(el => el.id == parseInt(participantId[0]) ? true : false)[0];
      participantTemp = [...props.vars.reactants];

    } else if (participantId[1] === 'product') {
      participant = props.vars.products.filter(el => el.id == parseInt(participantId[0]) ? true : false)[0];
      participantTemp = [...props.vars.products];
    }
    // console.log(participant, parseInt(participantId[0]));

    let participantInd = participantTemp.indexOf(participant);
    switch (input.id) {
      case 'stateInput':
        participant.state = input.value;
        break;

      case 'elementInput':
        participant.element = input.value;
        break;
      case 'coefficientInput':
        participant.coefficient = parseInt(input.value);
        break;
    }
    participantTemp[participantInd] = participant;
    // props.vars.setReactants([...participantTemp]);
  }
  return (
    <div id={props.id} className=" text-black flex flex-row justify-center shadow-sm border rounded-sm border-light-gray m-1">
      <Input id='coefficientInput' onChange={handleInputChange} className="w-10" type="number" min={1} />
      <Input id='elementInput' onChange={handleInputChange} className="max-w-[100px]" type="text" />
      <div className="flex flex-col  justify-center">
        <button onClick={handleDeleteParticipant} className="flex-1 bg-red-400 text-white">-</button>
        <Select onClick={handleInputChange} id='stateInput' className="flex-1">
          <Option value={'g'} />
          <Option value={'l'} />
          <Option value={'aq'} />
          <Option value={'s'} />
        </Select>
      </div>

    </div>
  );
}
export default ReactionParticipants;