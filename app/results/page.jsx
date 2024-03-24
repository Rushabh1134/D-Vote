"use client";
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'
import Confetti from 'react-confetti';

const results = () => {

  const [Btn, setBtn] = useState(false)

  const handleConf = () => {
    setBtn(true)
    window.setTimeout(() => {
      setBtn(false)
    }
    , 5000)
  }
  return (
    <div className="">
      <h1 className='text-4xl p-10 text-center'>Results</h1>
      <div className="flex justify-around items-center">
        <Card>
          <CardTitle>Candidate 1</CardTitle>
          <CardFooter>Vote Count 14</CardFooter>
        </Card>
        <Card>
          <CardTitle>Candidate 2</CardTitle>
          <CardFooter>Vote Count 19</CardFooter>
        </Card>
      </div>


      <div className="flex justify-center"><Button className='items-center justify-center flex' onClick={()=> {setBtn(handleConf)}}>Dclare Results</Button></div>
      {Btn && <div><Confetti height={window.innerHeight} width={window.innerWidth} tweenDuration={1000}/> <div className='text-center text-5xl text-white'>Candidate 2 Won</div></div>}
      
    </div>
  )
}

export default results