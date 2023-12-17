function ReactionParticipants(props) {
    return (
        <div className="border border-rose-600 text-black flex flex-row justify-center">
            <input className="w-10" type="number" min={1} />
            <input className="inline-flex" type="text" />
            <div className="flex flex-col  justify-center">
                <button onClick={props.deleteRAndP} className="flex-1 rounded-sm bg-green-600 text-white border border-green-500">-</button>
                <select className="flex-1">
                    <option>g</option>
                    <option>s</option>
                    <option>l</option>
                    <option>aq</option>
                </select>
            </div>
            <button onClick={props.addRAndP} className="flex-1 p-1 rounded-sm bg-green-600 text-white border border-green-500">+</button>
        </div>
    )
}
export default ReactionParticipants