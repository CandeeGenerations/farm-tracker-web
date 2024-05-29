export const get = (key: string) => typeof window !== 'undefined' && localStorage.getItem(key)

export const set = (key: string, value: string) => typeof window !== 'undefined' && localStorage.setItem(key, value)

export const remove = (key: string) => typeof window !== 'undefined' && localStorage.removeItem(key)
