import { MediaType } from "./MediaType"

export interface RequestBody {
	content: { [mediaType: string]: MediaType }
	description?: string
	required?: boolean
}
