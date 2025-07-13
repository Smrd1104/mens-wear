import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import TrackOrderTimeline from '../components/TrackOrderTimeline';
import { getColorNameFromHex } from '../utils/colors';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const colorMap = {
    '#bf4922': 'Brown',
    '#000000': 'Black',
    '#ffffff': 'White',
    '#ff0000': 'Red',
    '#0000ff': 'Blue',
    '#00ff00': 'Green',
    '#1a2999': 'Indigo', // Add any custom hex mappings here
  };

  // const getColorName = (hexColor) => {
  //   if (!hexColor) return '';
  //   const cleanHex = hexColor.replace('|', '').trim();

  //   try {
  //     const result = namer(cleanHex);
  //     return result.ntc[0].name; // Returns the closest color name
  //   } catch {
  //     return 'Unknown';
  //   }
  // };


  const extractSizeAndColor = (sizeString, colorHexFromField = '') => {
    if (!sizeString && !colorHexFromField) return { size: '', color: '', hexColor: '' };

    let size = sizeString;
    let hexColor = colorHexFromField;

    if (sizeString.includes('|')) {
      const parts = sizeString.split('|');
      size = parts[0];
      hexColor = parts[1];
    }

    return {
      size,
      color: getColorNameFromHex(hexColor),
      hexColor,
    };
  };

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        { userId: localStorage.getItem('userId') },
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrderItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const { size, color, hexColor } = extractSizeAndColor(item.size, item.color);
            allOrderItem.push({
              ...item,
              size,
              color,
              hexColor,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
            });
          });
        });

        setOrderData(allOrderItem);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleInvoiceDownload = async (orderId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/invoice/download/${orderId}`, {
        headers: { token },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  useEffect(() => {
    setVisibleOrders(orderData.slice(0, itemsToShow));
  }, [itemsToShow, orderData]);

  useEffect(() => {
    if (token) loadOrderData();

    const interval = setInterval(() => {
      if (token) loadOrderData();
    }, 15000); // refresh every 15 seconds

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="border-t pt-22">
      <div className="text-2xl">
        <Title text1="my" text2="orders" />
      </div>

      <div>
        {visibleOrders.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b border-gray-500 text-gray-700 flex flex-col md:flex-row md:justify-between gap-4"
          >
            {/* Product Info */}
            <div className="flex items-start gap-6 text-sm">
              <img
                src={item?.image?.[0] || '/default-product.jpg'}
                alt="product"
                className="w-16 sm:w-20 object-cover rounded border"
                onError={(e) => (e.target.src = '/default-product.jpg')}
              />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>

                <div className="flex items-center gap-3 mt-1 text-base text-gray-700 flex-wrap">
                  <p>
                    {currency}
                    {Number(item?.price || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.hexColor && (
                    <div className="flex items-center gap-1">
                      <p>Color:</p>
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: item.hexColor }}
                        title={item.color}
                      />
                      <span className="text-sm text-gray-600">{getColorNameFromHex(item.hexColor)}</span>
                    </div>
                  )}

                </div>

                <p className="mt-2">
                  Date: <span className="text-gray-400">{new Date(item.date).toDateString()}</span>
                </p>
                <p className="mt-1">
                  Payment: <span className="text-gray-400">{item.paymentMethod}</span>
                </p>
              </div>
            </div>

            {/* Status / Actions */}
            <div className="w-full md:w-1/2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${item.status === 'Delivered'
                    ? 'bg-green-500'
                    : item.status === 'Out for Delivery'
                      ? 'bg-yellow-500'
                      : item.status === 'Processing' || item.status === 'Order Processed'
                        ? 'bg-blue-500'
                        : item.status === 'Cancelled' || item.status === 'Rejected'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                    }`}
                ></span>
                <p className="capitalize text-base md:text-sm">{item.status}</p>
              </div>

              <button
                className="border px-4 py-2 text-sm font-medium rounded-sm w-fit"
                onClick={() => setSelectedOrderId(item.orderId)}
              >
                Track Order
              </button>

              {item.status === 'Delivered' && (
                <button
                  className="border px-4 py-2 text-sm font-medium rounded-sm w-fit"
                  onClick={() => handleInvoiceDownload(item.orderId)}
                >
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleOrders.length < orderData.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setItemsToShow((prev) => prev + 5)}
            className="px-6 py-2 border border-black cursor-pointer text-sm hover:bg-black hover:text-white transition duration-300"
          >
            Load More
          </button>
        </div>
      )}

      {selectedOrderId && (
        <TrackOrderTimeline
          orderId={selectedOrderId}
          token={token}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default Orders;










// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import axios from 'axios';
// import TrackOrderTimeline from '../components/TrackOrderTimeline';

// const Orders = () => {
//   const { backendUrl, token, currency } = useContext(ShopContext);
//   const [orderData, setOrderData] = useState([]);
//   const [visibleOrders, setVisibleOrders] = useState([]);
//   const [itemsToShow, setItemsToShow] = useState(5);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);

//   const colorMap = {
//     '#bf4922': 'Brown',
//     '#000000': 'Black',
//     '#FFFFFF': 'White',
//     '#FF0000': 'Red',
//     '#0000FF': 'Blue',
//     '#00FF00': 'Green',
//     '#1a2999': 'Indigo', // Add any custom hex mappings here

//   };

//   const getColorName = (hexColor) => {
//     if (!hexColor) return '';
//     const cleanHex = hexColor.replace('|', '');
//     return colorMap[cleanHex] || cleanHex;
//   };

//   const extractSizeAndColor = (sizeString) => {
//     if (!sizeString) return { size: '', color: '' };
//     const parts = sizeString.split('|');
//     return {
//       size: parts[0],
//       color: getColorName(parts[1]),
//       hexColor: parts[1],
//     };
//   };

//   const loadOrderData = async () => {
//     try {
//       if (!token) return;
//       const response = await axios.post(
//         `${backendUrl}/api/order/userorders`,
//         { userId: localStorage.getItem('userId') },
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         let allOrderItem = [];
//         response.data.orders.forEach((order) => {
//           order.items.forEach((item) => {
//             const { size, color, hexColor } = extractSizeAndColor(item.size);
//             allOrderItem.push({
//               ...item,
//               size,
//               color,
//               hexColor,
//               status: order.status,
//               payment: order.payment,
//               paymentMethod: order.paymentMethod,
//               date: order.date,
//               orderId: order._id,
//             });
//           });
//         });

//         setOrderData(allOrderItem);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleInvoiceDownload = async (orderId) => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/order/invoice/download/${orderId}`, {
//         headers: { token },
//         responseType: 'blob',
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `invoice-${orderId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error('Error downloading invoice:', error);
//     }
//   };

//   useEffect(() => {
//     setVisibleOrders(orderData.slice(0, itemsToShow));
//   }, [itemsToShow, orderData]);

//   useEffect(() => {
//     if (token) loadOrderData();

//     const interval = setInterval(() => {
//       if (token) loadOrderData();
//     }, 1500); // Refresh every 15s

//     return () => clearInterval(interval);
//   }, [token]);


//   return (
//     <div className='border-t pt-22'>
//       <div className='text-2xl'>
//         <Title text1={'my'} text2={'orders'} />
//       </div>

//       <div>
//         {visibleOrders.map((item, index) => (
//           <div
//             key={index}
//             className='py-4 border-t border-b border-gray-500 text-gray-700 flex flex-col md:flex-row md:justify-between gap-4'
//           >
//             <div className='flex items-start gap-6 text-sm'>
//               <img
//                 src={item?.image?.[0] || '/default-product.jpg'}
//                 alt='product'
//                 className='w-16 sm:w-20 object-cover rounded border'
//                 onError={(e) => (e.target.src = '/default-product.jpg')}
//               />
//               <div>
//                 <p className='sm:text-base font-medium'>{item.name}</p>
//                 <div className='flex items-center gap-3 mt-1 text-base text-gray-700 flex-wrap'>
//                   <p>
//                     {currency}
//                     {Number(item?.price || 0).toLocaleString('en-IN', {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                   </p>
//                   <p>Quantity: {item.quantity}</p>
//                   {item.size && <p>Size: {item.size}</p>}
//                   {item.hexColor && (
//                     <div className='flex items-center gap-1'>
//                       <p>Color:</p>
//                       <div
//                         className='w-3 h-3 rounded-full border'
//                         style={{ backgroundColor: item.hexColor }}
//                         title={item.color}
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <p className='mt-2'>
//                   Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span>
//                 </p>
//                 <p className='mt-2'>
//                   Payment: <span className='text-gray-400'>{item.paymentMethod}</span>
//                 </p>
//               </div>
//             </div>

//             <div className='w-full md:w-1/2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6'>
//               <div className='flex items-center gap-2'>

//                 <div className='flex items-center gap-2'>
//                   <span
//                     className={`w-2 h-2 rounded-full ${item.status === 'Delivered'
//                       ? 'bg-green-500'
//                       : item.status === 'Out for Delivery'
//                         ? 'bg-yellow-500'
//                         : item.status === 'Processing' || item.status === 'Order Processed'
//                           ? 'bg-blue-500'
//                           : item.status === 'Cancelled' || item.status === 'Rejected'
//                             ? 'bg-red-500'
//                             : 'bg-gray-400'
//                       }`}
//                   ></span>
//                   <p className='capitalize text-base md:text-sm'>{item.status}</p>
//                 </div>
//               </div>

//               <button
//                 className='border px-4 py-2 text-sm font-medium rounded-sm w-fit'
//                 onClick={() => setSelectedOrderId(item.orderId)}
//               >
//                 Track Order
//               </button>

//               {item.status === 'Delivered' && (
//                 <button
//                   className='border px-4 py-2 text-sm font-medium rounded-sm w-fit'
//                   onClick={() => handleInvoiceDownload(item.orderId)}
//                 >
//                   Download Invoice
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {visibleOrders.length < orderData.length && (
//         <div className='text-center mt-6'>
//           <button
//             onClick={() => setItemsToShow((prev) => prev + 5)}
//             className='px-6 py-2 border border-black cursor-pointer text-sm hover:bg-black hover:text-white transition duration-300'
//           >
//             Load More
//           </button>
//         </div>
//       )}

//       {selectedOrderId && (
//         <TrackOrderTimeline
//           orderId={selectedOrderId}
//           token={token}
//           onClose={() => setSelectedOrderId(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default Orders;






// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from "../context/ShopContext"
// import Title from "../components/Title"
// import axios from 'axios'
// import TrackOrderTimeline from '../components/TrackOrderTimeline'

// const Orders = () => {
//     const { backendUrl, token, currency } = useContext(ShopContext)
//     const [orderData, setOrderData] = useState([])
//     const [visibleOrders, setVisibleOrders] = useState([]);
//     const [itemsToShow, setItemsToShow] = useState(5);
//     const [selectedOrderId, setSelectedOrderId] = useState(null);

//     // Color mapping from hex to color names
//     const colorMap = {
//         '#bf4922': 'Brown',
//         '#000000': 'Black',
//         '#FFFFFF': 'White',
//         '#FF0000': 'Red',
//         '#0000FF': 'Blue',
//         '#00FF00': 'Green',
//         // Add more color mappings as needed
//     }

//     const getColorName = (hexColor) => {
//         if (!hexColor) return '';
//         // Remove any | character if present
//         const cleanHex = hexColor.replace('|', '');
//         return colorMap[cleanHex] || cleanHex;
//     }

//     const extractSizeAndColor = (sizeString) => {
//         if (!sizeString) return { size: '', color: '' };

//         const parts = sizeString.split('|');
//         if (parts.length === 1) return { size: parts[0], color: '' };

//         return {
//             size: parts[0],
//             color: getColorName(parts[1]),
//             hexColor: parts[1] // Keep original hex for display
//         };
//     }
//     const loadOrderData = async () => {
//         try {
//             if (!token) return;

//             const response = await axios.post(
//                 backendUrl + "/api/order/userorders",
//                 { userId: localStorage.getItem("userId") },
//                 { headers: { token } }
//             );

//             if (response.data.success) {
//                 let allOrderItem = [];
//                 response.data.orders.forEach((order) => {
//                     order.items.forEach((item) => {
//                         const { size, color, hexColor } = extractSizeAndColor(item.size);

//                         allOrderItem.push({
//                             ...item,
//                             size,
//                             color,
//                             hexColor,
//                             status: order.status,
//                             payment: order.payment,
//                             paymentMethod: order.paymentMethod,
//                             date: order.date,
//                             orderId: order._id,
//                         });
//                     });
//                 });

//                 setOrderData(allOrderItem); // ✅ Store full order list
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };


//     // const loadOrderData = async () => {
//     //     try {
//     //         if (!token) return null;

//     //         const response = await axios.post(
//     //             backendUrl + "/api/order/userorders",
//     //             { userId: localStorage.getItem("userId") },
//     //             { headers: { token } }
//     //         )

//     //         if (response.data.success) {
//     //             let allOrderItem = [];
//     //             response.data.orders.forEach((order) => {
//     //                 order.items.forEach((item) => {
//     //                     const { size, color, hexColor } = extractSizeAndColor(item.size);

//     //                     allOrderItem.push({
//     //                         ...item,
//     //                         size: size,
//     //                         color: color,
//     //                         hexColor: hexColor,
//     //                         status: order.status,
//     //                         payment: order.payment,
//     //                         paymentMethod: order.paymentMethod,
//     //                         date: order.date,
//     //                         orderId: order._id
//     //                     })
//     //                 })
//     //             })

//     //             setOrderData(allOrderItem)
//     //             setVisibleOrders(allOrderItem.slice(0, itemsToShow));
//     //         }
//     //     } catch (error) {
//     //         console.log(error)
//     //     }
//     // }


//     const handleInvoiceDownload = async (orderId) => {
//         try {
//             const response = await axios.get(`${backendUrl}/api/order/invoice/download/${orderId}`, {
//                 headers: { token },
//                 responseType: 'blob', // Needed to download file
//             });

//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `invoice-${orderId}.pdf`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error("Error downloading invoice:", error);
//         }
//     };



//     useEffect(() => {
//         setVisibleOrders(orderData.slice(0, itemsToShow));
//     }, [itemsToShow, orderData]);

//     useEffect(() => {
//         loadOrderData()
//     }, [token])

//     return (
//         <div className='border-t pt-22'>
//             <div className='text-2xl'>
//                 <Title text1={'my'} text2={'orders'} />
//             </div>

//             <div>
//                 {visibleOrders.map((item, index) => (
//                     <div key={index} className='py-4 border-t border-b border-gray-500 text-gray-700 flex flex-col md:flex-row md:justify-between gap-4'>
//                         <div className='flex items-start gap-6 text-sm'>
//                             <img src={item.image[0]} alt='' className='w-16 sm:w-20' />
//                             <div>
//                                 <p className='sm:text-base font-medium'>{item.name}</p>
//                                 <div className='flex items-center gap-3 mt-1 text-base text-gray-700 flex-wrap'>
//                                     <p className='text-md'>
//                                         {currency}
//                                         {Number(item?.price || 0).toLocaleString('en-IN', {
//                                             minimumFractionDigits: 2,
//                                             maximumFractionDigits: 2
//                                         })}
//                                     </p>                                    <p>Quantity: {item.quantity}</p>
//                                     {item.size && <p>Size: {item.size}</p>}
//                                     {item.hexColor && (
//                                         <div className="flex items-center gap-1">
//                                             <p>Color:</p>
//                                             <div
//                                                 className="w-3 h-3 rounded-full border"
//                                                 style={{ backgroundColor: item.hexColor }}
//                                                 title={item.color}
//                                             />

//                                         </div>
//                                     )}
//                                 </div>
//                                 <p className='mt-2'>Date:<span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
//                                 <p className='mt-2'>Payment:<span className='text-gray-400'>{item.paymentMethod}</span></p>
//                             </div>
//                         </div>
//                         <div className="w-full md:w-1/2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
//                             <div className="flex items-center gap-2">
//                                 <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
//                                 <p className="capitalize text-base md:text-sm">{item.status}</p>
//                             </div>

//                             <button
//                                 className="border px-4 py-2 text-sm font-medium rounded-sm w-fit"
//                                 onClick={() => setSelectedOrderId(item.orderId)}
//                             >
//                                 Track Order
//                             </button>

//                             {item.status === 'Delivered' && (
//                                 <button
//                                     className="border px-4 py-2 text-sm font-medium rounded-sm w-fit"
//                                     onClick={() => handleInvoiceDownload(item.orderId)}
//                                 >
//                                     Download Invoice
//                                 </button>
//                             )}
//                         </div>




//                     </div>
//                 ))}
//             </div>

//             {visibleOrders.length < orderData.length && (
//                 <div className="text-center mt-6">
//                     <button
//                         onClick={() => setItemsToShow(prev => prev + 5)}
//                         className="px-6 py-2 border border-black cursor-pointer text-sm hover:bg-black hover:text-white transition duration-300"
//                     >
//                         Load More
//                     </button>
//                 </div>
//             )}


//             {/* {itemsToShow < orderData.length && (
//                 <div className="text-center mt-6">
//                     <button
//                         onClick={() => setItemsToShow(prev => prev + 5)}
//                         className="px-6 py-2 border border-black cursor-pointer text-sm hover:bg-black hover:text-white transition duration-300"
//                     >
//                         Load More
//                     </button>
//                 </div>
//             )} */}

//             {selectedOrderId && (
//                 <TrackOrderTimeline
//                     orderId={selectedOrderId}
//                     token={token}
//                     onClose={() => setSelectedOrderId(null)}
//                 />
//             )}
//         </div>
//     )
// }

// export default Orders