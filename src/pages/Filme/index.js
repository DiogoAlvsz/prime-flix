import { useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import api from '../../services/api';
import './filme-info.css';
import {toast} from 'react-toastify'

function Filme(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [filme, setFilme] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function LoadFilme() {
            await api.get(`/movie/${id}`, {
                params:{
                    api_key: "d560751136ea9e8248c99f982eec61ab",
                    language: "pt-BR",
                }
            })
            .then((response)=>{
                setFilme(response.data);
                setLoading(false);
            })
            .catch(()=>{
                console.log("FILME NÃO ENCONTRADO")
                navigate("/", {replace:true});
                return;
            })
        }
        LoadFilme();

    }, [navigate, id])

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@primeflix");
    
        let filmesSalvos = [];
    
        if (minhaLista) {
            try {
                filmesSalvos = JSON.parse(minhaLista);
            } catch (e) {
                console.error("Erro ao ler lista de filmes:", e);
                filmesSalvos = [];
            }
        }
    
        const hasFilme = filmesSalvos.some(filmesSalvo => filmesSalvo.id === filme.id);
    
        if (hasFilme) {
            toast.warn("Esse filme já está salvo na lista de favoritos!")
            return;
        }
    
        filmesSalvos.push(filme);
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
        toast.success("Filme salvo na lista de favoritos!")
    }
    
    


    if(loading){
        return(
            <div className='filme-info'>
                <h1>Carregando detalhes...</h1>
            </div>
        )
    }
    return(
        <div className='filme-info'>
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}></img>
            <h3>Sinopse</h3>
            <span>{filme.overview}</span>
            <strog>Avaliação: {filme.vote_average.toFixed(1)} / 10</strog>
        <div className='area-buttons'>
            <button onClick={salvarFilme}>Salvar</button>
            
                <a target="blank" rel="external" href={`https://youtube.com/results?search_query=${filme.title} Trailer`}>
                    Trailer
                </a>
        
        </div>

        </div>
    )
}

export default Filme;