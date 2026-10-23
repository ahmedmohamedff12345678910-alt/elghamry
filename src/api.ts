export type Product = { id: string; name: string; description?: string; unit: string; category_name?: string; retail_price: number; wholesale_price: number; stock_quantity: number; image_url?: string | null; is_active: boolean };
export type CartLine = { product: Product; quantity: number; priceType: 'retail' | 'wholesale' };
const seed: Product[] = [];
const readProducts = (): Product[] => { try { const x=localStorage.getItem('ghomry_products'); return x?JSON.parse(x):seed; } catch { return seed; } };
const saveProducts=(p:Product[])=>localStorage.setItem('ghomry_products',JSON.stringify(p));
const readOrders=():any[]=>{try{return JSON.parse(localStorage.getItem('ghomry_orders')||'[]')}catch{return []}};
export const api = {
 products: async () => ({products:readProducts().filter(p=>p.is_active)}),
 categories: async () => ({categories:[...new Set(readProducts().map(p=>p.category_name||'مواد غذائية'))].map((name,i)=>({id:name,name}))}),
 createOrder: async (body:{customer_name:string;phone:string;address?:string;notes?:string;price_type:'retail'|'wholesale';items:{product_id:string;quantity:number}[]}) => {
  const products=readProducts(); let subtotal=0; const items=body.items.map(i=>{const p=products.find(x=>x.id===i.product_id);if(!p||!p.is_active||p.stock_quantity<i.quantity)throw new Error(`الكمية غير متاحة للمنتج ${p?.name||''}`);const price=body.price_type==='retail'?p.retail_price:p.wholesale_price;subtotal+=price*i.quantity;p.stock_quantity-=i.quantity;return {product_id:p.id,name:p.name,unit:p.unit,price,quantity:i.quantity,total:price*i.quantity};});
  saveProducts(products); const order={id:crypto.randomUUID(),order_number:'GH-'+Date.now().toString().slice(-8),customer_name:body.customer_name,phone:body.phone,address:body.address||'',notes:body.notes||'',price_type:body.price_type,items,items_subtotal:subtotal,delivery_fee:null,status:'under_review',created_at:new Date().toISOString()};localStorage.setItem('ghomry_orders',JSON.stringify([order,...readOrders()]));return {order};
 },
 trackOrder: async (orderNumber:string,phone:string)=>{const order=readOrders().find(o=>o.order_number===orderNumber&&o.phone===phone);if(!order)throw new Error('لم يتم العثور على طلب مطابق.');return {order};}
};
export const localStore={readProducts,saveProducts,readOrders,saveOrders:(o:any[])=>localStorage.setItem('ghomry_orders',JSON.stringify(o))};
