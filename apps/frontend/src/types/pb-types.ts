/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Categories = "categories",
	OrderItems = "order_items",
	Orders = "orders",
	ProductVariants = "product_variants",
	Products = "products",
	Stores = "stores",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CategoriesRecord = {
	name?: string
}

export type OrderItemsRecord = {
	order: RecordIdString
	product: RecordIdString
	quantity: number
}

export enum OrdersStatusOptions {
	"BuyerInProcess" = "BuyerInProcess",
	"WaitForVendor" = "WaitForVendor",
	"VendorInProcess" = "VendorInProcess",
	"Done" = "Done",
}
export type OrdersRecord = {
	status: OrdersStatusOptions
	store?: RecordIdString
	user?: RecordIdString
}

export type ProductVariantsRecord = {
	product?: RecordIdString
}

export type ProductsRecord = {
	category?: RecordIdString
	description?: string
	images?: string[]
	name: string
	price?: number
	store?: RecordIdString
}

export type StoresRecord = {
	avatar?: string
	description?: string
	name: string
	products?: RecordIdString[]
	user?: RecordIdString
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type OrderItemsResponse<Texpand = unknown> = Required<OrderItemsRecord> & BaseSystemFields<Texpand>
export type OrdersResponse<Texpand = unknown> = Required<OrdersRecord> & BaseSystemFields<Texpand>
export type ProductVariantsResponse<Texpand = unknown> = Required<ProductVariantsRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Texpand = unknown> = Required<ProductsRecord> & BaseSystemFields<Texpand>
export type StoresResponse<Texpand = unknown> = Required<StoresRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	categories: CategoriesRecord
	order_items: OrderItemsRecord
	orders: OrdersRecord
	product_variants: ProductVariantsRecord
	products: ProductsRecord
	stores: StoresRecord
	users: UsersRecord
}

export type CollectionResponses = {
	categories: CategoriesResponse
	order_items: OrderItemsResponse
	orders: OrdersResponse
	product_variants: ProductVariantsResponse
	products: ProductsResponse
	stores: StoresResponse
	users: UsersResponse
}