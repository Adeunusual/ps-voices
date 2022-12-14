import { useState, useRef } from 'react';
import '../assets/css/index.css';
import { FaCheckCircle, FaEllipsisH } from 'react-icons/fa';
import { data } from './CardData.jsx';
import html2canvas from "html2canvas";
import avatar from '../assets/images/avatar.jpg';
import PopUpModal from './PopUpModal';
import RenderPopUp from './RenderPopUp';


const Card = () => {
    // state
    const [checkCardId, setCheckCardId] = useState(-1)

    //state dataGotten
    const [holdDataGotten, setHoldDataGotten] = useState({});
    //-----
    //--- function to set clone and its style
    const setClone = (card) => {
        const clone = card.cloneNode(true);
        // change the card style
        clone.classList.add('resize');
        //-- set the cardClone state
        return clone;
    }

    //-----
    //handle Card click
    const handleCardClick = (id) => {
        setCardImg(avatar);
        setCheckCardId(id);
    }

    //Handle PopUp Modal 
    const [popUpBtn, setPopUpBtn] = useState(false);

    // Handling DetailspopUp trigger
    const [usePopUpBtn, setusePopUpBtn] = useState(false);

    //handle ImageChange
    //Handle setImg
    const [cardImg, setCardImg] = useState(avatar);

    const handleCardImgChange = (event) => {
        setCardImg(URL.createObjectURL(event.target.files[0]));
    }

    //function shareCard
    function shareCard(canvas) {
        canvas.toBlob((blob) => {
            const files = [new File([blob], 'imgFile.png',
                {
                    type: 'image/jpeg',
                    lastModified: new Date().getTime()
                })];
            let shareObj = { files: files };
            navigator.share(shareObj);
        }, 'image/jpg')
    }
    // download card
    function downloadCard(data) {
        const link = document.createElement('a');
        // ---
        link.href = data;
        link.download = 'Peter Obi Card.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    //render card
    const [renderCardImg, setRenderCardImg] = useState("");

    //Handle card Download & share
    const printRef = useRef();

    const setSize = (width = null, height = null) => {
        printRef.current.style.width = width;
        printRef.current.style.height = height;
    }
    //--
    const handleCard = async (option) => {
        const { width, height } = printRef.current.getBoundingClientRect()
        const cardClone = setClone(printRef.current);
        setSize(width + 'px', height + 'px');

        // ---
        const parent = document.createElement("div");
        parent.classList.add('styleParent');
        parent.appendChild(cardClone)
        //-----
        if (cardClone) printRef.current.parentElement.appendChild(parent);
        else return;
        // ---
        const digitalCard = cardClone.firstElementChild;
        const canvas = await html2canvas(digitalCard, { backgroundColor: null });
        // parent.remove();
        setSize();

        const data = canvas.toDataURL('image/jpg');
        // ---
        switch (option) {
            case 'share': return shareCard(canvas);
            case 'render':
                setRenderCardImg(data);
                setusePopUpBtn(true);
                setPopUpBtn(false);
                break;
            default: return downloadCard(data)
        }
        // ---
    };

    // handle txt input
    const [cardTxtInput, setCardTxtInput] = useState(
        {
            twitterHandle: '',
            name: ''
        }
    );
    return (
        <div className="cardComponent">
            {data.map((dataGotten, id) => (
                <div
                    className={`card-border ${dataGotten.className}`}
                    onClick={() => {
                        handleCardClick(dataGotten.cardId)
                        setHoldDataGotten(dataGotten)
                    }}
                    key={dataGotten.cardId}
                >
                    <div className="candidateDetails">
                        <div>
                            <div className="candidate-imgWrapper">
                                <img className='candidate-imgWrapper-img' src={dataGotten.candidateImg} alt="candidateImg" />
                                <FaCheckCircle className='icon' />
                            </div>
                            <p className='candidate-name'>{dataGotten.candidateName}</p>
                        </div>
                        <div className='icon-w'>
                            <FaEllipsisH className='icon' />
                        </div>
                    </div>

                    <div id='card'
                        className="card"
                        onClick={() => setPopUpBtn(true)}
                        ref={id === checkCardId ? printRef : null}>
                        <div className="card-details">
                            <div className="cardImg">
                                {id === checkCardId ? <img src={cardImg} alt="" /> : <img src={avatar} alt="uploadedImg" />}
                            </div>
                            <img className='card' src={dataGotten.card} alt="card" />

                            {/* tiwtter Handle And Name*/}
                            <div className="twitterHandle">
                                {dataGotten.twitterHandle && <p className="displayName">@abayomi</p>}
                                {dataGotten.twitterHandle && <p className='hiddenName'>{cardTxtInput.twitterHandle} </p>}
                            </div>

                            {/* Name */}
                            <div className="name">
                                {dataGotten.name && <p className="displayName">ANITA ADELEKE</p>}
                                {dataGotten.name && <p className='hiddenName'>{cardTxtInput.name} </p>}
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }

            <PopUpModal trigger={popUpBtn} setTrigger={setPopUpBtn} handleCardImgChange={handleCardImgChange} imgSrc={cardImg} renderCard={handleCard} cardTxtInput={cardTxtInput} setCardTxtInput={setCardTxtInput} needImg={holdDataGotten.needImg} />

            <RenderPopUp trigger={usePopUpBtn} setTrigger={setusePopUpBtn} handleCard={handleCard} cardSrc={renderCardImg}>
            </RenderPopUp>
        </div >
    )
}

export default Card;