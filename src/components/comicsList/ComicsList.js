import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import './comicsList.scss';



import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(1541);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    let imageNotAvailable = null;

    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    const charList = comicsList.map((char, i) => {
        imageNotAvailable = char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                                                ? {objectFit: 'fill'} : null;
        return (
            <li className="comics__item" key = {char.id}>
                <Link to={`${char.id}`}>
                    <img src={char.thumbnail} alt="ultimate war" className="comics__item-img"/>
                    <div className="comics__item-name">{char.title}</div>
                    <div className="comics__item-price">{char.price}</div>
                </Link>
            </li>
        )
    })

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            <ul className="comics__grid">
                {charList}
            </ul>
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;