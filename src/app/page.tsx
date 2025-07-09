'use client'

import { useState, useEffect, JSX } from 'react'

const FiveLetterDescriptions = [
  'Meubel',
  'Niet groot',
  'Ruimtevaartuig',
  'Voorzetsel',
  'Mist',
  'Zeer groot',
  'Orgaan',
  'Beslist',
  'Onmiddelijk voorafgaand',
  'gorden',
  'loofboom',
  'deel van een broek',
  'schat, lieveling',
  'boombladeren',
  'Zeer begaafd persoon',
  'Schaakstuk',
  'Griekse godin',
  'Bouwmateriaal',
  'Rustig!',
  'Geweldig',
  'Meid',
  'Vishaak',
  'Stadswal',
  'Flink en sterk',
  'Zoekend verzamelen',
]

const SixLetterDescriptions = [
  'Aanzien opleverend',
  'Affiche',
  'Afmeting',
  'Begeleider',
  'Betasten',
  'Bijna nooit',
  'Bovendien',
  'Deel v.e. vaartuig',
  'Door water omringd gebied',
  'Doorschieten',
  'Groep musici',
  'Heester',
  'Helderwit marmer',
  'Knoeien',
  'Koopman',
  'Metaalsoort',
  'Nog voorhanden',
  'Onderdeel v.e. fotocamera',
  'Onwaarheid spreken',
  'Stijloefening',
  'Strijkpers',
  'Tuingereedschap',
  'Vinger (informeel)',
  'Vloerkleed',
  'Zaniken',
]

const SevenLetterDescriptions = [
  'Beroep',
  'Binnenbekleedsel',
  'Boeten',
  'Deel v.e. bloem',
  'Dierenverblijf',
  'Een hoorbaar geluid geven',
  'Geestdriftig',
  'Hachelijk',
  'Huisdier',
  'Javaans orkest',
  'Kort baardhaartje',
  'Krenken',
  'Landelijk',
  'Lijdzaam',
  'Nutteloze lading',
  'Onkreukbaar',
  'Oplichterij',
  'Potsierlijk',
  'Proberen',
  'Raam',
  'Schadelijk',
  'Sterk krullen',
  'Toezeggen',
  'Vloeien',
  'Wilddief',
]

type WordMap = Record<string, string[]>

function getExtraLetter(base: string, extended: string): string[] {
  const baseArr = base.split('')
  const extra: string[] = []

  for (const char of extended) {
    const index = baseArr.indexOf(char)
    if (index !== -1) {
      baseArr.splice(index, 1)
    } else {
      extra.push(char)
    }
  }

  return baseArr.length === 0 && extra.length === 1 ? extra : []
}

export default function PuzzleSolver() {
  const [selected5, setSelected5] = useState(FiveLetterDescriptions[0])
  const [word5, setWord5] = useState('')
  const [wordPairs5, setWordPairs5] = useState<WordMap>({})

  const [selected6, setSelected6] = useState(SixLetterDescriptions[0])
  const [word6, setWord6] = useState('')
  const [wordPairs6, setWordPairs6] = useState<WordMap>({})

  const [selected7, setSelected7] = useState(SevenLetterDescriptions[0])
  const [word7, setWord7] = useState('')
  const [wordPairs7, setWordPairs7] = useState<WordMap>({})

  const handleSubmit = (
    e: React.FormEvent,
    length: number,
    selected: string,
    word: string,
    setWord: (v: string) => void,
    setPairs: React.Dispatch<React.SetStateAction<WordMap>>
  ) => {
    e.preventDefault()
    const clean = word.toUpperCase()
    if (clean.length !== length) {
      alert(`Only ${length}-letter words allowed`)
      return
    }

    setPairs(prev => {
      const current = prev[selected] || []
      if (!current.includes(clean)) {
        return { ...prev, [selected]: [...current, clean] }
      }
      return prev
    })
    setWord('')
  }

  const handleDelete = (
    map: WordMap,
    setMap: React.Dispatch<React.SetStateAction<WordMap>>,
    desc: string,
    word: string
  ) => {
    setMap(prev => {
      const filtered = (prev[desc] || []).filter(w => w !== word)
      const updated = { ...prev }
      if (filtered.length === 0) delete updated[desc]
      else updated[desc] = filtered
      return updated
    })
  }

  const flatten = (map: WordMap) =>
    Object.entries(map).flatMap(([desc, words]) => words.map(word => ({ desc, word })))

  const wordList5 = flatten(wordPairs5)
  const wordList6 = flatten(wordPairs6)
  const wordList7 = flatten(wordPairs7)

  const getMatching6 = (w5: string) =>
    wordList6.filter(({ word }) => getExtraLetter(w5, word).length === 1)

  const getMatching7 = (w6: string) =>
    wordList7.filter(({ word }) => getExtraLetter(w6, word).length === 1)

  const highlightExtra = (base: string, extended: string) => {
    const baseLetters = base.split('')
    const extra: string[] = []
    const display: JSX.Element[] = []

    for (let i = 0; i < extended.length; i++) {
      const char = extended[i]
      const idx = baseLetters.indexOf(char)
      if (idx !== -1) {
        baseLetters.splice(idx, 1)
        display.push(<span key={i}>{char}</span>)
      } else {
        display.push(
          <span key={i} className="text-red-600 font-bold">
            {char}
          </span>
        )
      }
    }
    return display
  }

  // Load saved data on first render
useEffect(() => {
  const saved5 = localStorage.getItem('wordPairs5')
  const saved6 = localStorage.getItem('wordPairs6')
  const saved7 = localStorage.getItem('wordPairs7')

  if (saved5) setWordPairs5(JSON.parse(saved5))
  if (saved6) setWordPairs6(JSON.parse(saved6))
  if (saved7) setWordPairs7(JSON.parse(saved7))
}, [])

// Persist changes to localStorage
useEffect(() => {
  localStorage.setItem('wordPairs5', JSON.stringify(wordPairs5))
}, [wordPairs5])

useEffect(() => {
  localStorage.setItem('wordPairs6', JSON.stringify(wordPairs6))
}, [wordPairs6])

useEffect(() => {
  localStorage.setItem('wordPairs7', JSON.stringify(wordPairs7))
}, [wordPairs7])

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 p-8 space-y-10">
      <h1 className="text-2xl font-bold text-center">🧩 ND.nl Puzzle Solver</h1>

      {/* Forms */}
      <div className="flex flex-col md:flex-row gap-6">
        {[5, 6, 7].map(length => {
          const selected = length === 5 ? selected5 : length === 6 ? selected6 : selected7
          const word = length === 5 ? word5 : length === 6 ? word6 : word7
          const setWord = length === 5 ? setWord5 : length === 6 ? setWord6 : setWord7
          const setSelected = length === 5 ? setSelected5 : length === 6 ? setSelected6 : setSelected7
          const setMap =
            length === 5 ? setWordPairs5 : length === 6 ? setWordPairs6 : setWordPairs7

          return (
            <form
              key={length}
              onSubmit={(e) =>
                handleSubmit(e, length, selected, word, setWord, setMap)
              }
              className="flex-1 bg-white p-4 rounded shadow space-y-3"
            >
              <h2 className="font-semibold">{length}-Letter Word</h2>
              <select
                className="w-full border p-2 rounded"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {length === 5
                  ? FiveLetterDescriptions.map((d) => (
                      <option key={d}>{d}</option>
                    ))
                  : length === 6
                  ? SixLetterDescriptions.map((d) => (
                      <option key={d}>{d}</option>
                    ))
                  : SevenLetterDescriptions.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
              </select>
              <input
                maxLength={length}
                value={word}
                onChange={(e) => setWord(e.target.value.toUpperCase())}
                placeholder={`${length}-letter word`}
                className="w-full border p-2 rounded"
              />
              <button className="w-full bg-blue-600 text-white py-2 rounded">
                Add
              </button>
            </form>
          )
        })}
      </div>

      {/* Word Lists with Delete */}
      <div className="grid md:grid-cols-3 gap-6">
        {[{ title: '5-letter', map: wordPairs5, setMap: setWordPairs5 },
          { title: '6-letter', map: wordPairs6, setMap: setWordPairs6 },
          { title: '7-letter', map: wordPairs7, setMap: setWordPairs7 }
        ].map(({ title, map, setMap }) => (
          <div key={title}>
            <h3 className="font-semibold mb-2">{title} Words</h3>
            <ul className="bg-white rounded shadow p-3 space-y-1">
              {Object.entries(map).map(([desc, words]) =>
                words.map((word) => (
                  <li key={`${desc}-${word}`} className="flex justify-between items-center">
                    <span>
                      <strong>{desc}:</strong> {word}
                    </span>
                    <button
                      onClick={() => handleDelete(map, setMap, desc, word)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </li>
                ))
              )}
              {Object.keys(map).length === 0 && (
                <li className="text-gray-500 italic">No words</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow overflow-hidden table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">5-Letter</th>
              <th className="px-4 py-2 text-left">6-Letter</th>
              <th className="px-4 py-2 text-left">7-Letter</th>
            </tr>
          </thead>
          <tbody>
            {wordList5.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4 italic">
                  No 5-letter entries yet
                </td>
              </tr>
            )}
            {wordList5.map(({ desc, word: w5 }) => {
              const sixes = getMatching6(w5)

              return (
                <tr key={`${desc}-${w5}`}>
                  <td className="px-4 py-2 align-top">{desc}</td>
                  <td className="px-4 py-2 align-top text-gray-500 font-semibold">{w5}</td>
                  <td className="px-4 py-2 align-top">
                    {sixes.length > 0 ? (
                      <ul className="space-y-1">
                        {sixes.map(({ word: w6 }) => (
                          <li key={w6} className="text-gray-500 font-semibold">
                            {highlightExtra(w5, w6)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="px-4 py-2 align-top">
                    {sixes.flatMap(({ word: w6 }) =>
                      getMatching7(w6).map(({ word: w7 }) => (
                        <div key={w6 + '-' + w7} className="text-gray-500 font-semibold">
                          {highlightExtra(w6, w7)}
                        </div>
                      ))
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}