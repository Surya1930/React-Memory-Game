import { useState, useEffect } from 'react'
import Form from './components/Form.jsx'
import MemoryCard from './components/MemoryCard.jsx'
import AssistiveTechInfo from './components/AssistiveTechInfo.jsx'
import GameOver from './components/GameOver.jsx'

export default function App() {
    const [isGameOn, setIsGameOn] = useState(false)
    const [emojisData, setEmojisData] = useState([])
    const [selectedCards, setSelectedCards] = useState([])
    const [matchedCards, setMatchedCards] = useState([])
    const [areAllCardsMatched, setAreAllCardsMatched] = useState(false)

    
    useEffect(() => {
        if (selectedCards.length === 2 && selectedCards[0].name == selectedCards[1].name ){
            setMatchedCards(prevMatchedCards => [...prevMatchedCards, ...selectedCards])
        }
    }, [selectedCards])


    useEffect(() => {
        if (emojisData.length && matchedCards.length === emojisData.length){
            setAreAllCardsMatched(true)
        }
    },[matchedCards, emojisData])

    async function startGame(e) {
        e.preventDefault()
        try {
            const response = await fetch("https://emojihub.yurace.pro/api/all/category/animals-and-nature")

            if(!response.ok){
                throw new Error("Error Fetching Data")
            }

            const data = await response.json()
            const dataSlice = await getDataSlice(data)
            const emojisArray =  await getEmojisArray(dataSlice)

            setEmojisData(emojisArray)
            setIsGameOn(true)

        } catch (err){
            console.log(err)
        }
    }

//get data array
    async function getDataSlice(data){
        const randomIndices = getRandomIndices(data)
        const dataSlice = randomIndices.map(x => data[x])
        return dataSlice
    }

// getting random indies
    function getRandomIndices(data){
        const randomIndicesArray = []

        for(let i=0; i < 10; i++){
            const index = Math.floor(Math.random() * data.length)
            if (!(index in randomIndicesArray)){
                randomIndicesArray.push(index)
            }else{
                i--
            }
        }
        return randomIndicesArray;
    }

    //dubplicating array fun
    async function getEmojisArray(data){
        const pairedEmojisArray = shuffleArray(data.concat(data))
        return pairedEmojisArray 
    }

    //shuffle algo
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }


    function turnCard(name, index) {
        if ( selectedCards.length < 2){
            setSelectedCards(prevSelectedCard => [...prevSelectedCard, {name , index}])
        }else if ( selectedCards.length == 2) {
            setSelectedCards([{name, index}])
        }
    }


    //restgame
    function resetGame(){
        setIsGameOn(false)
        setSelectedCards([])
        setMatchedCards([])
        setAreAllCardsMatched(false)
    }
    
    return (
        <main>
            <h1>Memory</h1>
            {areAllCardsMatched && 
                <GameOver handleClick={resetGame}/>
            }
            {!isGameOn && <Form handleSubmit={startGame} />}
            {isGameOn && !areAllCardsMatched && 
                <AssistiveTechInfo 
                    emojisData={emojisData} 
                    matchedCards={matchedCards} 
                />
            }
            {isGameOn && 
                <MemoryCard 
                    selectedCards={selectedCards} 
                    matchedCards={matchedCards} 
                    handleClick={turnCard} 
                    data={emojisData} 
                />
            }
        </main>
    )
}