import { useState, Dispatch } from 'react'

function stringOrUndefined(str:string|null):string|undefined {
  if (str === null)
    return undefined
  return str
}

function stringOrEmptyString(str:string|null):string {
  if (str === null)
    return ""
  return str
}

export function useLocaleState(localItem: string): [string|undefined, Dispatch<string>]{
    let str = stringOrUndefined( localStorage.getItem(localItem) )

    const [loc, setState] = useState<string | undefined>( str );
    const setLoc = (newItem: string) => {
      setState(newItem);
      localStorage.setItem(localItem, newItem);
    }
    return [loc, setLoc];
}
  
export function useLocaleState1(localItem: string): [string, Dispatch<string>]{
  let str = stringOrEmptyString( localStorage.getItem(localItem) )

  const [loc, setState] = useState<string>( str );
  const setLoc = (newItem: string) => {
    setState(newItem);
    localStorage.setItem(localItem, newItem);
  }
  return [loc, setLoc];
}