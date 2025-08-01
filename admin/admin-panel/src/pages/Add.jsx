import React, { useState } from 'react'
import { assets } from '../assets/admin_assets/assets'
import { backendUrl } from '../App';
import axios from "axios"
import { toast } from 'react-toastify';

const Add = ({ token }) => {
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState("#000000");

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [discountPrice, setDiscountPrice] = useState("")
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("")
    const [bestseller, setBestseller] = useState(false)
    const [latest, setLatest] = useState(false)
    const [festive, setFestive] = useState(false);
    const [trending, setTrending] = useState(false);
    const [sizes, setSizes] = useState([])
    const [createdProductId, setCreatedProductId] = useState(null);
    const [skuQuantities, setSKUQuantities] = useState({});

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData();

            formData.append("name", name.trim());
            formData.append("description", description.trim());
            formData.append("price", price);
            formData.append("discountPrice", discountPrice);
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestseller", bestseller)
            formData.append("latest", latest)
            formData.append("festive", festive);
            formData.append("trending", trending);
            formData.append("sizes", JSON.stringify(sizes))
            formData.append("colors", JSON.stringify(colors));

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            const response = await axios.post(backendUrl + "/api/product/add", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const productId = response.data?.product?._id;

                if (!productId) {
                    toast.error("Product ID not found in response");
                    return;
                }

                setCreatedProductId(productId);
                toast.success("Product added successfully");
            } else {
                toast.error(response.data.message || "Something went wrong");
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleSKUQuantityChange = (skuCode, field, value) => {
        setSKUQuantities((prev) => ({
            ...prev,
            [skuCode]: {
                ...prev[skuCode],
                [field]: Number(value),
            },
        }));
    };

    const handleSKUCreate = async () => {
        try {
            for (const skuCode in skuQuantities) {
                const [productId, size, color] = skuCode.split("||");
                const skuPayload = {
                    productId,
                    size,
                    color,
                    quantityAvailable: skuQuantities[skuCode]?.quantityAvailable || 0,
                    quantityReserved: skuQuantities[skuCode]?.quantityReserved || 0,
                };
                await axios.post(`${backendUrl}/api/sku/create`, skuPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            toast.success("SKUs created successfully");

            // Reset all fields
            setSKUQuantities({});
            setCreatedProductId(null);
            setName('');
            setDescription('');
            setImage1(false);
            setImage2(false);
            setImage3(false);
            setImage4(false);
            setPrice('');
            setDiscountPrice('');
            setColors([]);
            setSizes([]);
            setCategory('');
            setSubCategory('');
            setBestseller(false);
            setLatest(false);
            setFestive(false);
            setTrending(false)
        } catch (error) {
            console.log(error);
            toast.error("Failed to create SKUs");
        }
    };

    return (
        <>
            <form onSubmit={onSubmitHandler} className=''>
                <div className='flex flex-col w-full items-start gap-3'>
                    <p className='mb-2'>Upload image</p>
                    <div className='flex gap-2 '>
                        {[image1, image2, image3, image4].map((img, i) => (
                            <label key={i} htmlFor={`image${i + 1}`}>
                                <img className='w-20' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt='' />
                                <input onChange={(e) => {
                                    const setter = [setImage1, setImage2, setImage3, setImage4][i];
                                    setter(e.target.files[0]);
                                }} type='file' id={`image${i + 1}`} hidden />
                            </label>
                        ))}
                    </div>

                    <div className='w-full'>
                        <p className='capitalize mb-2'>product Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} type='text' className='w-full max-w-[500px] px-3 py-2' placeholder='Enter Product Name' />
                    </div>

                    <div className='w-full'>
                        <p className='capitalize mb-2'>product description</p>
                        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Enter Product Description' />
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                        <div>
                            <p className='capitalize mb-2'>product category</p>
                            <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
                                <option value="">Select Category</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>
                        <div>
                            <p className='capitalize mb-2'>product Subcategory</p>
                            <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
                                <option value="">Select Subcategory</option>
                                <option value="Topwear">Topwear</option>
                                <option value="Bottomwear">Bottomwear</option>
                                <option value="Winterwear">Winterwear</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                        <div>
                            <p className='capitalize mb-2'>product price</p>
                            <input onChange={(e) => setPrice(e.target.value)} value={price} type='number' placeholder='price' className='w-full px-3 py-2 sm:w-[160px]' />
                        </div>
                        <div>
                            <p className='capitalize mb-2'>discount price</p>
                            <input onChange={(e) => setDiscountPrice(e.target.value)} value={discountPrice} type='number' placeholder='discountPrice' className='w-full px-3 py-2 sm:w-[160px]' />
                        </div>
                    </div>

                    <div>
                        <p className='capitalize mb-2'>product sizes</p>
                        <div className='flex gap-3'>
                            {["S", "M", "L", "XL", "XXL"].map(size => (
                                <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}>
                                    <p className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{size}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex gap-5'>
                        <div className='flex gap-2 mt-2'>
                            <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type='checkbox' id='bestseller' />
                            <label className='cursor-pointer' htmlFor='bestseller'> Add to bestseller</label>
                        </div>
                        <div className='flex gap-2 mt-2'>
                            <input onChange={() => setLatest(prev => !prev)} checked={latest} type='checkbox' id='latest' />
                            <label className='cursor-pointer' htmlFor='latest'> Add to latest</label>
                        </div>
                        <div className='flex gap-2 mt-2'>
                            <input onChange={() => setFestive(prev => !prev)} checked={festive} type='checkbox' id='festive' />
                            <label className='cursor-pointer' htmlFor='festive'> Add to festive</label>
                        </div>
                        <div className='flex gap-2 mt-2'>
                            <input onChange={() => setTrending(prev => !prev)} checked={trending} type='checkbox' id='trending' />
                            <label className='cursor-pointer' htmlFor='festive'> Add to Trending</label>
                        </div>
                    </div>

                    <div className='mt-4 w-full'>
                        <p className='capitalize mb-2'>product color varieties</p>
                        <div className='flex gap-3 items-center'>
                            <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className='w-10 h-10 border cursor-pointer' />
                            <button type="button" onClick={() => {
                                if (!colors.includes(newColor)) {
                                    setColors(prev => [...prev, newColor]);
                                }
                            }} className='px-3 py-1 bg-black text-white rounded'>Add Color</button>
                        </div>

                        <div className='flex gap-2 mt-2 flex-wrap'>
                            {colors.map((color, index) => (
                                <div key={index} style={{ backgroundColor: color }} className='w-8 h-8 border-2 rounded cursor-pointer relative' title={color} onClick={() => setColors(prev => prev.filter(c => c !== color))}>
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 cursor-pointer">x</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className='w-28 py-3 mt-4 bg-black text-white cursor-pointer' type='submit' disabled={createdProductId !== null}>Add</button>
                </div>
            </form>

            {createdProductId && (
                <div className='mt-6 border-t pt-4'>
                    <h3 className='text-lg font-semibold mb-4'>Add SKUs</h3>
                    <div className='space-y-4'>
                        {colors.map((color) =>
                            sizes.map((size) => {
                                const skuCode = `${createdProductId}||${size}||${color}`;
                                return (
                                    <div
                                        key={skuCode}
                                        className='flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 border p-2 rounded-md'
                                    >
                                        <div className='text-sm font-medium break-all w-full sm:w-[40%]'>{skuCode}</div>

                                        <input
                                            type='number'
                                            placeholder='Qty Available'
                                            className='border p-2 w-full sm:w-1/4 text-sm'
                                            value={skuQuantities[skuCode]?.quantityAvailable || ''}
                                            onChange={(e) =>
                                                handleSKUQuantityChange(skuCode, 'quantityAvailable', e.target.value)
                                            }
                                        />
                                        <input
                                            type='number'
                                            placeholder='Qty Reserved'
                                            className='border p-2 w-full sm:w-1/4 text-sm'
                                            value={skuQuantities[skuCode]?.quantityReserved || ''}
                                            onChange={(e) =>
                                                handleSKUQuantityChange(skuCode, 'quantityReserved', e.target.value)
                                            }
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <button
                        type='button'
                        className='mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded shadow-sm'
                        onClick={handleSKUCreate}
                    >
                        Save SKUs
                    </button>
                </div>

            )}
        </>
    )
}

export default Add;









// import React, { useState } from 'react'
// import { assets } from '../assets/admin_assets/assets'
// import { backendUrl } from '../App';
// import axios from "axios"
// import { toast } from 'react-toastify';

// const Add = ({ token }) => {

//     const [colors, setColors] = useState([]);
//     const [newColor, setNewColor] = useState("#000000");


//     const [image1, setImage1] = useState(false)
//     const [image2, setImage2] = useState(false)
//     const [image3, setImage3] = useState(false)
//     const [image4, setImage4] = useState(false)

//     const [name, setName] = useState("")
//     const [description, setDescription] = useState("")
//     const [price, setPrice] = useState("")
//     const [discountPrice, setDiscountPrice] = useState("")
//     const [category, setCategory] = useState("");
//     const [subCategory, setSubCategory] = useState("")
//     const [bestseller, setBestseller] = useState(false)
//     const [latest, setLatest] = useState(false)
//     const [sizes, setSizes] = useState([])

//     const [createdProductId, setCreatedProductId] = useState(null);
//     const [skuQuantities, setSKUQuantities] = useState({});

//     const onSubmitHandler = async (e) => {
//         e.preventDefault()


//         try {
//             const formData = new FormData();

//             formData.append("name", name.trim());
//             formData.append("description", description.trim());
//             formData.append("price", price);
//             formData.append("discountPrice", discountPrice);
//             formData.append("category", category)
//             formData.append("subCategory", subCategory)
//             formData.append("bestseller", bestseller)
//             formData.append("latest", latest)

//             formData.append("sizes", JSON.stringify(sizes))
//             formData.append("colors", JSON.stringify(colors));



//             image1 && formData.append("image1", image1)
//             image2 && formData.append("image2", image2)
//             image3 && formData.append("image3", image3)
//             image4 && formData.append("image4", image4)


//             const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });

//             console.log("Product add response:", response.data);

//             if (response.data.success) {
//                 const productId = response.data?.product?._id;


//                 if (!productId) {
//                     toast.error("Product ID not found in response");
//                     return;
//                 }

//                 setCreatedProductId(productId);
//                 toast.success("Product added successfully");

//                 // do not reset values yet — wait until SKU creation
//             } else {
//                 toast.error(response.data.message || "Something went wrong");
//             }


//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }

//     const handleSKUQuantityChange = (skuCode, field, value) => {
//         setSKUQuantities((prev) => ({
//             ...prev,
//             [skuCode]: {
//                 ...prev[skuCode],
//                 [field]: Number(value),
//             },
//         }));
//     };


//     const handleSKUCreate = async () => {
//         try {
//             for (const skuCode in skuQuantities) {
//                 const [productId, size, color] = skuCode.split("||");
//                 const skuPayload = {
//                     productId,
//                     size,
//                     color,
//                     quantityAvailable: skuQuantities[skuCode]?.quantityAvailable || 0,
//                     quantityReserved: skuQuantities[skuCode]?.quantityReserved || 0,
//                 };
//                 await axios.post(`${backendUrl}/api/sku/create`, skuPayload, { headers: { token } });
//             }
//             toast.success("SKUs created successfully");
//             // ✅ Now reset all fields
//             setSKUQuantities({});
//             setCreatedProductId(null);
//             setName('');
//             setDescription('');
//             setImage1(false);
//             setImage2(false);
//             setImage3(false);
//             setImage4(false);
//             setPrice('');
//             setDiscountPrice('');
//             setColors([]);
//             setSizes([]);
//             setCategory('');
//             setSubCategory('');
//             setBestseller(false);
//             setLatest(false);
//         } catch (error) {
//             console.log(error);
//             toast.error("Failed to create SKUs");
//         }
//     };





//     return (
//         <form onSubmit={onSubmitHandler} className=''>
//             <div className='flex flex-col w-full items-start gap-3'>
//                 <p className='mb-2'>Upload image</p>

//                 <div className='flex gap-2 '>
//                     <label htmlFor='image1'>
//                         <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt='' />
//                         <input onChange={(e) => setImage1(e.target.files[0])} type='file' id='image1' hidden />
//                     </label>
//                     <label htmlFor='image2'>
//                         <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt='' />
//                         <input onChange={(e) => setImage2(e.target.files[0])} type='file' id='image2' hidden />
//                     </label>
//                     <label htmlFor='image3'>
//                         <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt='' />
//                         <input onChange={(e) => setImage3(e.target.files[0])} type='file' id='image3' hidden />
//                     </label>
//                     <label htmlFor='image4'>
//                         <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt='' />
//                         <input onChange={(e) => setImage4(e.target.files[0])} type='file' id='image4' hidden />
//                     </label>
//                 </div>

//                 <div className='w-full'>
//                     <p className='capitalize mb-2'>product Name</p>
//                     <input onChange={(e) => setName(e.target.value)} value={name} type='text' className='w-full max-w-[500px] px-3 py-2' placeholder='Enter Product Name' />
//                 </div>


//                 <div className='w-full'>
//                     <p className='capitalize mb-2'>product description</p>
//                     <textarea onChange={(e) => setDescription(e.target.value)} value={description} type='text' className='w-full max-w-[500px] px-3 py-2' placeholder='Enter Product Name' />
//                 </div>


//                 <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
//                     <div className=''>
//                         <p className='capitalize mb-2'>product category</p>
//                         <select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
//                             <option value="">Select Category</option>
//                             <option value="Men">Men</option>
//                             <option value="Women">Women</option>
//                             <option value="Kids">Kids</option>
//                         </select>
//                     </div>

//                     <div>
//                         <p className='capitalize mb-2'>product Subcategory</p>
//                         <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'>
//                             <option value="">Select Subcategory</option>
//                             <option value="Topwear">Topwear</option>
//                             <option value="Bottomwear">Bottomwear</option>
//                             <option value="Winterwear">Winterwear</option>
//                         </select>
//                     </div>

//                 </div>
//                 <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

//                     <div>
//                         <p className='capitalize mb-2'>product price</p>
//                         <input onChange={(e) => setPrice(e.target.value)} value={price} type='number' placeholder='price' className='w-full px-3 py-2 sm:w-[160px]' />
//                     </div>
//                     <div>
//                         <p className='capitalize mb-2'>discount price</p>
//                         <input onChange={(e) => setDiscountPrice(e.target.value)} value={discountPrice} type='number' placeholder='discountPrice' className='w-full px-3 py-2 sm:w-[160px]' />
//                     </div>
//                 </div>


//                 <div>
//                     <p className='capitalize mb-2'>product sizes</p>
//                     <div className='flex gap-3'>
//                         <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
//                             <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"}  px-3 py-1 cursor-pointer`}>S</p>
//                         </div>
//                         <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
//                             <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"}  px-3 py-1 cursor-pointer`}>M</p>
//                         </div>
//                         <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
//                             <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"}  px-3 py-1 cursor-pointer`}>L</p>
//                         </div>
//                         <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
//                             <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"}  px-3 py-1 cursor-pointer`}>XL</p>
//                         </div>
//                         <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
//                             <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"}  px-3 py-1 cursor-pointer`}>XXL</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='flex  gap-5'>
//                     <div className='flex gap-2 mt-2'>
//                         <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type='checkbox' id='bestseller' />
//                         <label className='cursor-pointer' htmlFor='bestseller'> Add to bestseller</label>
//                     </div>
//                     <div className='flex gap-2 mt-2'>
//                         <input onChange={() => setLatest(prev => !prev)} checked={latest} type='checkbox' id='latest' />
//                         <label className='cursor-pointer' htmlFor='bestseller'> Add to latest</label>
//                     </div>
//                 </div>
//                 {/* <button className='w-28 py-3 mt-4 bg-black text-white cursor-pointer' type='submit'>Add</button> */}

//                 <div className='mt-4 w-full'>
//                     <p className='capitalize mb-2'>product color varieties</p>
//                     <div className='flex gap-3 items-center'>
//                         <input
//                             type="color"
//                             value={newColor}
//                             onChange={(e) => setNewColor(e.target.value)}
//                             className='w-10 h-10 border cursor-pointer'
//                         />
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 if (!colors.includes(newColor)) {
//                                     setColors(prev => [...prev, newColor]);
//                                 }
//                             }}
//                             className='px-3 py-1 bg-black text-white rounded'
//                         >
//                             Add Color
//                         </button>
//                     </div>

//                     {/* Show selected colors */}
//                     <div className='flex gap-2 mt-2 flex-wrap'>
//                         {colors.map((color, index) => (
//                             <div
//                                 key={index}
//                                 style={{ backgroundColor: color }}
//                                 className='w-8 h-8 border-2 rounded cursor-pointer relative'
//                                 title={color}
//                                 onClick={() => setColors(prev => prev.filter(c => c !== color))}
//                             >
//                                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 cursor-pointer">x</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <button className='w-28 py-3 mt-4 bg-black text-white cursor-pointer' type='submit'>Add</button>
//                 {/* SKU Form */}
//                 {createdProductId && (
//                     <div className='mt-6 border-t pt-4'>
//                         <h3 className='text-lg font-semibold mb-2'>Add SKUs</h3>
//                         {colors.map((color) =>
//                             sizes.map((size) => {
//                                 const skuCode = `${createdProductId}||${size}||${color}`;
//                                 return (
//                                     <div key={skuCode} className='flex items-center gap-4 mb-2'>
//                                         <div className='w-64'>{skuCode}</div>
//                                         <input type='number' placeholder='Qty Available' className='border p-1 w-32' value={skuQuantities[skuCode]?.quantityAvailable || ''} onChange={(e) => handleSKUQuantityChange(skuCode, 'quantityAvailable', e.target.value)} />
//                                         <input type='number' placeholder='Qty Reserved' className='border p-1 w-32' value={skuQuantities[skuCode]?.quantityReserved || ''} onChange={(e) => handleSKUQuantityChange(skuCode, 'quantityReserved', e.target.value)} />
//                                     </div>
//                                 );
//                             })
//                         )}
//                         <button className='mt-4 px-4 py-2 bg-blue-600 text-white rounded' onClick={handleSKUCreate}>Save SKUs</button>
//                     </div>
//                 )}

//             </div>
//         </form>
//     )
// }

// export default Add
