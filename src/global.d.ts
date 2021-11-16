/// <reference types="@sveltejs/kit" />

declare module '*&img'
declare module 'virtual:windi-devtools'

type Unpack<T> = {
	[K in keyof T]: T[K] & { type: K }
}[keyof T]
