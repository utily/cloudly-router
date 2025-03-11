import { model } from "../model"
export class Items {
	private constructor(private readonly backend: Record<model.Identifier, model.Item>) {}
	list(): model.Item[] {
		return Object.values(this.backend)
	}
	fetch(identifier: model.Identifier): model.Item | undefined {
		return this.backend[identifier]
	}
	create(item: model.Item.Creatable): model.Item | undefined {
		const id = model.Identifier.generate()
		return id in this.backend ? this.create(item) : (this.backend[id] = { ...item, id })
	}
	replace(item: model.Item): model.Item | undefined {
		return item.id in this.backend ? (this.backend[item.id] = item) : undefined
	}
	remove(identifier: model.Identifier): boolean {
		const result = !!this.backend[identifier]
		if (result)
			delete this.backend[identifier]
		return result
	}
	static create(items: model.Item[] = []): Items {
		return new Items(Object.fromEntries(items.map(item => [item.id, item])))
	}
}
export namespace Items {}
