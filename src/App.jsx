// import { response } from "express" //
import { useState } from "react"

const App = () => {
  const [image, setImage] = useState(null)
  const [value, setValue] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const surpriseOptions = [
    "A imagem tem um unicórnio?",
    "A imagem é incrivelmente azul?",
    "Tem um dinossauro na imagem?",
    "A imagem está cheia de gatos fofos?",
    "Tem uma pizza deliciosa na imagem?",
    "A imagem brilha com estrelas cintilantes?",
    "A imagem tem um pato usando óculos de sol?"
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const uploadImage = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setImage(e.target.files[0])
    try {
      const options = {
        method: "POST",
        body: formData
      }

      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      console.log(data)
    } catch (err) {
      console.error(err)
      setError("Algo não funcionou! Tente novamente.")
    }
  }

  // console.log(image)
  const analyzeImage = async () => {
    if (!image) {
      setError('Erro! Deve ter uma imagem existente!')
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value
        }),
        headers: {
          'Content-type': 'application/json'
        }
      }

      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      setResponse(data)
    } catch (err) {
      console.error(err)
      setError("Algo não funcionou! Por favor, tente novamente.")

    }
  }

  const clear = () => {
    setImage(null)
    setValue('')
    setResponse('')
    setError('')
  }

  return (
    <div className='app'>
      <section className="search-section">
        <div className="image-container">
          {image && <img className="image" src={URL.createObjectURL(image)} />}
        </div>
        {!response && <p className="extra-info" >
          <span>
            <label htmlFor="files"> carregue uma imagem </label>
            <input onChange={uploadImage} alt="" id="files" accept="image/*" type="file" hidden />
          </span>
          para fazer perguntas.
        </p>}
        <p>O que você quer saber sobre a imagem?
          <button className="surprise" onClick={surprise} disabled={response}>Surpreenda-me</button>
        </p>
        <div className="input-container">
          <input
            value={value}
            placeholder="O que está na imagem..."
            onChange={e => setValue(e.target.value)}
          />
          {(!response && !error) && <button onClick={analyzeImage}>Pergunte-me</button>}
          {(response || error) && <button onClick={clear}>Limpar</button>}
        </div>
        {error && <p>{error}</p>}
        {response && <p className="answer">{response}</p>}
      </section>
    </div>
  )
}

export default App
