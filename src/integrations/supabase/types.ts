export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: number
                    image_url: string
                    category: string | null
                    stock_quantity: number
                    metal_type: string | null
                    gemstone: string | null
                    weight: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price: number
                    image_url: string
                    category?: string | null
                    stock_quantity?: number
                    metal_type?: string | null
                    gemstone?: string | null
                    weight?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    image_url?: string
                    category?: string | null
                    stock_quantity?: number
                    metal_type?: string | null
                    gemstone?: string | null
                    weight?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    display_name: string | null
                    phone_number: string | null
                    preferences: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    display_name?: string | null
                    phone_number?: string | null
                    preferences?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    display_name?: string | null
                    phone_number?: string | null
                    preferences?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            user_roles: {
                Row: {
                    id: string
                    user_id: string
                    role: 'admin' | 'user'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    role: 'admin' | 'user'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    role?: 'admin' | 'user'
                    created_at?: string
                }
            }
        }
    }
}
