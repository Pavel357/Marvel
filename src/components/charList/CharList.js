import React,{useState, useEffect, useRef} from 'react'
import './charList.scss';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(1541);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharLoaded)
    }

    const onCharLoaded = (newChars) => {
        let ended = false;
        if(newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended)
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }


    let imageNotAvailable = null;

    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    const charList = chars.map((char, i) => {
        imageNotAvailable = char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                                                ? {objectFit: 'fill'} : null;
        return (
            <li className="char__item" key = {char.id}
                onClick={() => {
                    props.onCharSelected(char.id);
                    focusOnItem(i);
                }}
                ref={el => itemRefs.current[i] = el} >
                <img src={char.thumbnail} alt="abyss" style={imageNotAvailable}/>
                <div className="char__name">{char.name}</div>
            </li>
        )
    })

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            <ul className="char__grid">
                {charList}
            </ul>
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)} >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;