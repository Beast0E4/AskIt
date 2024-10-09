// eslint-disable-next-line react/prop-types
function PicModal( {picture, name, closeModal} ) {
    console.log(picture, name, closeModal)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={closeModal}>
            <div className="bg-gray-950 border-[2px] border-gray-800 p-6 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                <button 
                    className="absolute top-2 right-2 text-gray-600 text-2xl font-bold hover:text-white" 
                    onClick={closeModal}
                >
                    &times;
                </button>
                <p className="text-lg font-semibold text-[#F2BEA0] mb-2">{name}</p>
                <img src={picture} alt={name} className="w-[30rem] h-auto mb-4 rounded" />
            </div>
        </div>
    )
}

export default PicModal;