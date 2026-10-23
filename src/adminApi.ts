import { localStore } from './api';
export const supabase = null;
export const adminApi = {
 products: async (_token:string) => ({products:localStore.readProducts()}),
 addProduct: async (_token:string, body:any) => {const p={...body,id:crypto.randomUUID(),category_name:body.category_name||'مواد غذائية',is_active:true};localStore.saveProducts([...localStore.readProducts(),p]);return {product:p};},
 updateProduct: async (_token:string,id:string,body:any) => {const products=localStore.readProducts().map(p=>p.id===id?{...p,...body}:p);localStore.saveProducts(products);return {product:products.find(p=>p.id===id)};},
 archiveProduct: async (_token:string,id:string) => {localStore.saveProducts(localStore.readProducts().map(p=>p.id===id?{...p,is_active:false}:p));return {ok:true};},
 orders: async (_token:string) => ({orders:localStore.readOrders()}),
 updateOrder: async (_token:string,id:string,body:any) => {const orders=localStore.readOrders().map(o=>o.id===id?{...o,...body,updated_at:new Date().toISOString()}:o);localStore.saveOrders(orders);return {order:orders.find(o=>o.id===id)}}
};
