import { BsStar, BsStarFill, BsRecordCircle, BsCalendar2CheckFill, BsClock, BsHeart, BsPlusCircle, BsPlusCircleFill, BsFlag, BsSignDeadEnd, BsFlagFill, BsSignDeadEndFill, BsCameraVideoFill, BsPlay } from "react-icons/bs"
import {EcommercenavLinks, reviews, CartItems, feedbackData} from '../../../constants/objects'
import image from '../../../constants/images.js'
import AppNavbar from '../../../partials/navBar/AppNavbar'
import NavMenu from '../../../partials/navBar/NavMenu'
import user from "../../../assets/images/chick1.jpeg"
import farmer from "../../../assets/images/heroF1.png"
import ProductCard from './components/ProductCard.jsx'
import {BsGeoAlt} from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, addToCart } from '../../../redux/feature/cartSlice.js';
import { getProduct, allProducts } from '../../../redux/feature/productSlice.js';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import LandingFooter from "../../../partials/footer/LandingFooter.jsx"
import {calculateShippingCost} from "../../../Utils/helper.js"
import Popup from "../../loader/popup.jsx"
import BuyProduct from "../BuyProduct.jsx"


const ratings = {
	accurateDescription: 5.0,
	shippingSpeed: 2.9,
	reasonableShipping: 5.0,
	communication: 5.0,
  };
  
  const RatingBar = ({ title, value }) => {
	return (
		<div className="flex w-[48%] gap-4 ">
			<p>{title}</p>
			<div className="w-8 my-2 bg-gray-300 rounded-full h-1">
				<div style={{ width: `${(value / 5) * 100}%` }} className="w-full bg-black rounded-full h-full"></div>
			</div>
			<p>{value}</p>	
		</div>
	);
  };

export default function ProductDetail(){
		const { id } = useParams();
	const [products, setProducts] = useState([])
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
	const dispatch = useDispatch();
    const [selectedMeasurementUnit, setSelectedMeasurementUnit] = useState({});
    // const productList = useSelector([]);
	// setProducts(productList);


    useEffect(() => {
        console.log('start')
	    const fetchProducts = async () => {
	        const response = await dispatch(getProduct());
	        if (response.meta.requestStatus === 'fulfilled') {
	            setProducts(response.payload.data); // Adjust based on your actual response structure
	        }
	    };	
			fetchProducts();
		}, [dispatch]);

	 console.log("Original product list : ",products)
    console.log(String(id))
		
	const product = products.find(p => p._id === String(id));
	console.log("This product : ",product)
    const [selectImage, setSelectImage] = useState(null)
	const MainProducts = products.filter(item =>
		item?.farmer?.firstname?.toLowerCase().includes(product?.farmer?.firstname?.toLowerCase())
	);

	console.log("Farmer's product" , MainProducts)
		
    const handleMeasurementChange = ( measurementUnit) => {
        // const item = cartItems.data.products.find(product => product._id === itemId);
        const selectedBundle = product.priceBundles.find(bundle => bundle.measurementUnit === measurementUnit);
        setSelectedMeasurementUnit({
			quantity: selectedBundle ? selectedBundle.quantity : 0,
            price: selectedBundle ? selectedBundle.price : 0,
            measurement: measurementUnit,
        });
    };

	  // Check if product is defined before accessing its properties
    useEffect(() => {
        if (product) {
            setSelectImage(product.images[0]); // Set the selectImage when product is available
        }
    }, [product]); // Run whenever product changes


	const [showAll, setShowAll] = useState(true);

	const toggleFeedback = () => {
	  setShowAll(!showAll);
	};
  
	const displayedFeedback = showAll
	  ? feedbackData.allItems.slice(0, 3)
	  : feedbackData.currentItem;

	const [isOpen, setIsOpen] = useState(false);
	const [currentVideo, setCurrentVideo] = useState('');

	const handleOpenModal = (url) => {
		setCurrentVideo(url);
		setIsOpen(true);
	};

	const handleCloseModal = () => {
		setIsOpen(false);
		setCurrentVideo('');
	};

	const Settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 4,
	    responsive: [
	      {
	        breakpoint: 1024,
	        settings: {
	          slidesToShow: 3,
	          slidesToScroll: 1,
	          infinite: false,
	          dots: false
	        }
	      },
	      {
	        breakpoint: 600,
	        settings: {
	          slidesToShow: 2,
	          slidesToScroll: 1,
	          initialSlide: 2
	        }
	      },
	      {
	        breakpoint: 480,
	        settings: {
	          slidesToShow: 1,
	          slidesToScroll: 1
	        }
	      }
	    ]
	};

	
	const TopBrandInfo = [
	{
		title: 'Highly Rated',
		description: '100K+ customers rate items from this brand highly',
	},
	{
		title: 'Trending',
		description: '100K+ orders for this brand in past 3 months',
	},
	{
		title: 'Low Returns',
		description: 'Customers usually keep items from this brand',
	},
	];

	const handleAddToCart = async (product) => {
		console.log("cart data :",product)
        try {
            const response = await dispatch(addCart({productId: product._id, quantity: 1})); // Await the Promise
            
			if(response.payload){
				const message = response.payload.message;
				setPopupMessage(message); // Set the message
			}else{
				const message = "Product already in cart"; // Adjust based on your actual response structure
				setPopupMessage(message); // Set the message
			}
            setPopupVisible(true); // Show the popup
            
            // Hide the popup after 3 seconds
            setTimeout(() => {
                setPopupVisible(false);
            }, 3000);
        } catch (error) {
            console.error('Failed to add to cart: ', error);
        }
	}
	
	const closePopup = () => {
        setPopupVisible(false);
    };
	

    // Get user data from Redux state
    const username = useSelector((state) => state.user.userInfo.firstname);  
    const role = useSelector((state) => state.user.role.label); 
    console.log("user name" + username)
    const isLoggedIn = Boolean(username); // Check if user data exists
    console.log(isLoggedIn)
	const farmerLocation = { lat: 34.0522, lon: -118.2437 }; // Example: Los Angeles
	const clientLocation = { lat: 36.1699, lon: -115.1398 }; 
	const shippingCost = calculateShippingCost(farmerLocation, clientLocation);
	

	return(
		<div className="">
			<AppNavbar array={EcommercenavLinks} see={false}/>
			<NavMenu array={EcommercenavLinks}/>	
			<div className=" py-4">
				<div>
					
					<div className="flex px-8 g300ap-4">
						<div className="w-3/5">
							<div className="flex gap-4 h-[500px]">
								<div className="w-1/6 px-2 flex flex-col gap-2">
									{ product &&
										product.images?.map((item, index) => (
										<img src={`process.env.NODE_APP_BASE_URL\\${item}`} onClick={() => setSelectImage(item)} className={`w-16 bg-gray-100 self-center cursor-pointer rounded-xl shadow-lg h-16 ${selectImage === item ? 'ring-[1px] ring-primary' : ''}`}/>
									))
									}
								</div>
								<div className="w-5/6 bg-gray-100 p-2 px-8 rounded-xl ">
									<img src={`process.env.NODE_APP_BASE_URL\\${selectImage}`} className="w-full  h-full"/>
								</div>
							</div>
							<div>
								<div>
									<p className="text-lg font-semibold pb-6 pt-8">Other recomendations from this farmer</p>
									<div className="flex gap-2">
										{ 
											MainProducts?.map((item, index) => (
												item._id !== product._id && item.farmer.firstname === product.farmer.firstname?
												<ProductCard
													id={item._id}
													image={item.images[0]}
													title={item.name}
													price={item.priceBundles[0].price}
													unit={item.priceBundles[0].measurementUnit}
													status={item.status}
													rate={item.rate}
													user={item.farmer}
													onAddToCart={handleAddToCart}
												/>:''
										))}
									</div>
									<div className="flex justify-end text-xs py-2 underline font-semibold cursor-pointer">
										{MainProducts.length > 4 ? 
											<p>See More</p>
											:''
										}
									</div>
								</div>

							</div>
						</div>
						<div className="w-2/5 px-4 ">
							<div className="flex flex-col gap-1">
								<p className="font-bold text-2xl">{product&& product.name.toUpperCase()}</p>
								<div className="flex gap-2">
								{product&&	
									// <img src={`process.env.NODE_APP_BASE_URL\\${product.farmer.image[0]}`} className="w-8 self-center cursor-pointer rounded-full shadow-lg h-8"/>
									 <p className="p-2 rounded-full bg-gray-200 px-3">{product.farmer.firstname.charAt(0)}</p>
								}
									<div className="text-xs font-bold">
										<p>{product&&product.farmer.firstname}e</p>
										<div className="flex underline gap-2">
											<p className="cursor-pointer">100% positive</p>
											<p className="cursor-pointer"><Link to={`/seller/${product&&product.farmer._id}`}>Seller's items</Link> </p>
											{/* <p className="cursor-pointer">Contact seller</p> */}
										</div>
									</div>
								</div>
								<div className="flex gap-4">
									<div className="flex gap-1 text-yellow-500"> 
										
										{[...Array(4)].map((_, index) => (
											<BsStarFill/>
										))}
										{/* Render unfilled stars */}
										{[...Array(5 - 4)].map((_, index) => (
											<BsStar/>
										))}
									</div>
									<p className="text-[12px] text-teal-600">1,153 ratings</p>
								</div>
								<div className="text-[12px] pb-2  border-gray-200 border-b-[1px] ">1k+ bought in past month</div>
								<p className="pt-1 text-sm">Condition: <span className="font-bold">{product &&product.status}</span></p>
								<div>
									<p className="text-xl font-bold">{product &&product.priceBundles[0].price} XAF 
										<span className='bg-gray-100 ml-2 p-1 px-2 text-sm rounded-full font-light text-gray-500'>
											per  {product &&product.priceBundles[0].quantity}
											<select
                                                    onChange={(e) => handleMeasurementChange( e.target.value)} 
													className="w-32 rounded-full font-bold outline-none bg-transparent">
												{
													product && 
													product.priceBundles?.map((item, index) => (
														<option key={index} value={item.measurementUnit}>{item.measurementUnit}</option>
													))
												}
											</select>
										</span>
									</p>
									<p className="text-gray-500 pb-2 pt-1 text-xs">{shippingCost}XAF Shiping</p>
								</div>
								<div className="flex gap-1 py-2 text-xs">
									<BsGeoAlt/>
									<p className=" text-teal-600">Deliver to Yaounde</p>
								</div>
								<div className="flex text-xs gap-2">
									<label for="qty" className="py-1">Quantity: </label>
									<input type="number" name="qty" value={1} className="w-12 outline-none p-1 border-[1px] rounded-lg bg-gray-50"/>
									<p className="py-1 text-gray-500 font-medium">10 available</p>
									<p className="py-1 text-red-500 font-bold ">8 sold</p>
								</div>
								<div className="flex flex-col mt-12 gap-2">
								{
									!isLoggedIn ?
										<>
											<Link to={'/login'}>
												<div className="bg-black text-white w-full font-bold cursor-pointer p-2 hover:shadow-lg rounded-lg text-center">Buy Product</div>
											</Link>
											<Link to={'/login'}>
												<div className="bg-primary text-white w-full font-bold cursor-pointer p-2 hover:shadow-lg rounded-lg text-center">Add to Cart</div>
											</Link>
											<Link to={'/login'}>
												<div className="ring-1 ring-primary text-primary w-full font-bold cursor-pointer p-2 hover:shadow-lg rounded-lg text-center">Chat Now</div>
											</Link>
										</>
									:	
									<>
										<Link to={'/market/buyproduct'}>
											<div className="bg-black text-white w-full font-bold cursor-pointer p-2 hover:shadow-lg rounded-lg text-center">Buy Product</div>
										</Link>
										<div onClick={()=>{handleAddToCart(product)}} className="bg-primary text-white w-full font-bold cursor-pointer p-2 hover:shadow-lg rounded-lg text-center">Add to Cart</div>
										<Link to={'/market/chat'}>
											<div className="ring-1 ring-primary text-primary w-full font-bold cursor-pointer p-2 hover:shadow-lg rounded-lg text-center">Chat Now</div>
										</Link>
									</>
								}
								</div>
								<div className="bg-gray-100 p-4 my-8 flex flex-col gap-2 rounded-lg">
									<div className="flex gap-4">
										<div className="p-2 rounded-full bg-white "><BsRecordCircle/></div>
										<p className="text-sm my-1 font-medium">People want this. 91 people are watching this.</p>
									</div>
									<div className="flex gap-4">
										<div className="p-2 rounded-full bg-white "><BsRecordCircle/></div>
										<p className="text-sm my-1 font-medium">This one's trendng. 817 have already sold</p>
									</div>
								</div>
								<div className="flex pt-2 text-sm gap-8">
									<p>Shipping: </p>
									<p className="text-left">
										<span className="font-semibold">2000XAF National Economy: tracked-signature.</span> 
										<span className="underline cursor-pointer">See details</span><br></br>
										<span className=" text-gray-500">
											National shiping of items may be subject to custom processing and additional charges.
											Located in: Yaounde, Messasi
										</span>
									</p>
								</div>
								<div className="flex pt-2 text-sm gap-8">
									<p>Delivery: </p>
									<p className="text-left">
										<span className="flex gap-1 font-semibold"><BsFlagFill size={20} className="text-orange-500 "/>
										Estimated between Thu, Oct 3 and Thu, Oct 24 to 0 <BsSignDeadEndFill size={18} className=""/> </span>
										<span className="text-gray-500">Please note the delivery estimate is</span>
										<span className="font-semibold"> greater that 25 business days.</span><br></br>
										<span className="text-gray-500">
											Please allow additional time if international delivery is subject to suctoms processing.
										</span>
									</p>
								</div>
								<div className="flex pt-2  text-sm gap-8">
									<p>Returns: </p>
									<p className="text-left">
										30 days returns. Buyer pays for return shipping.
										<span className="underline cursor-pointer">See details</span>
									</p>
								</div>
								<div className="flex gap-2 py-4 border-t-[1px] border-b-[1px] mt-4 border-gray-200">
									<p className="text-sm">Pay through : </p>
									<img src={image.OM} alt="OM image" className="w-16 rounded h-8" />
									<img src={image.MOMO} alt="OM image" className="w-16 rounded h-8" />
									<img src={image.PAYPAL} alt="OM image" className="w-8 rounded h-8" />
									<img src={image.VISA_CARD} alt="OM image" className="w-16 rounded h-8" />
								</div>

							</div>
						</div>
					</div>
				</div>
				<div className="flex p-8">
					<div className="w-1/2 bg-gray-100 px-8 py-4 rounded-s-lg">
						<p className="text-xl font-bold py-4">About this seller</p>
						<div className="flex gap-4">
							<img src={product&&product.farmer.image} alt="Seller image" className="w-20 h-20 bg-gray-200 rounded-full"/>
							<div className="py-2">
								<p className="text-lg font-bold">{product&&product.farmer.firstname}</p>
								<p className="text-sm">Crop Farming</p>
								<p className="text-xs">100% positive feedback - <span className="text-gray-400">75k items sold</span></p>
							</div>
						</div>
						<div className="flex gap-1 pt-4 text-sm">
							<BsCalendar2CheckFill/>
							<p>Joined Jan 2021</p>
						</div>
						<div className="flex gap-1 text-sm">
							<BsClock/>
							<p>JUsually respond within 24 hours</p>
						</div>
						<div className="flex flex-col py-8 gap-2">
							<div className="text-white text-center p-1 hover:shadow-md text-sm w-40 rounded-full bg-primary border-[1px] border-primary">Visit store</div>
							<div className="w-40 rounded-full text-center hover:shadow-md text-sm p-1 text-primary border-[1px] border-primary ">Contact</div>
							<div className="flex w-40 rounded-full justify-center hover:shadow-md gap-1 text-center text-sm p-1 text-primary border-[1px] border-primary ">
								<BsHeart className="my-1"/>
								<p className="">Save seller </p>
							</div>
						</div>
						<div>
							<div className="flex gap-5">
								<p className="font-bold">Popular categories form this store </p>
								<p className="text-xs underline cursor-pointer">See all</p>
							</div>
							<div className="flex flex-wrap gap-2 py-2">
								<p className="p-1 bg-gray-200 cursor-pointer rounded-full text-center w-fit text-xs px-4">Vegetables</p>
								<p className="p-1 bg-gray-200 cursor-pointer rounded-full text-center w-fit text-xs px-4">livestocks</p>
							</div>
						</div>
					</div>
					<div className="w-1/2 bg-gray-100 py-4 px-8 rounded-e-lg">
						<p className="text-xl font-bold py-4">Detailed seller ratings</p>
						<div className="flex gap-2 text-sm flex-wrap">	
							<RatingBar title="Accurate description" value={ratings.accurateDescription} />
							<RatingBar title="Shipping speed" value={ratings.shippingSpeed} />
							<RatingBar title="Reasonable shipping cost" value={ratings.reasonableShipping} />
							<RatingBar title="Communication" value={ratings.communication} />	
						</div>
							<p className="text-[11px] py-1 text-gray-400">Average for the last 12 months</p>
							<p className="text-xl py-4 font-bold">Seller feedback (22,715)</p>
							<div className="flex gap-8 text-sm">
								<p onClick={() => setShowAll(true)} className={`py-1 cursor-pointer text-black  ${showAll ? " border-b-[1px] font-semibold  border-black": ' '}`}  >This item </p>
								<p onClick={() => setShowAll(false)} className={`py-1 cursor-pointer text-black ${!showAll ? " border-b-[1px] font-semibold border-black": ' '} `}  >All Items</p>
							</div>
							<div className="mt-4  flex flex-col gap-4">
								{displayedFeedback.map((feedback) => (
									<div key={feedback.id} className=" text-sm">
										<div className="flex text-[11px] text-gray-500 gap-4">
										<div><BsPlusCircleFill size={12} className="my-1 text-primary"/></div>
										<span className="font-semibold">{feedback.user} </span>
										<span className="text-gray-500">{feedback.rating}</span>
										</div>
										<p className="">{feedback.comment}</p>
									</div>
								))}
							</div>
							<button
								className="mt-4 px-4 py-1 text-sm cursor-pointer text-primary border-[1px] border-primary rounded-full hover:shadow-md"
							>
								See All Feedback
							</button>
							
					</div>
				</div>
				<div className=" p-8">
					<div>
						<p className="text-xl font-bold">Videos</p>
						<div className="p-4">
							<p className="font-bold">Videos for this product</p>
							<div>
								
								<Slider {...Settings} className=" py-2">
								{product&& product.videos?.map((video, index) => (
									<div key={index} className="relative w-full">
										<div className="bg-gray-200 rounded-lg h-40">
										<img src={video.thumbnail} alt={video.title} className="rounded-lg h-40 w-full" />
										<div className="absolute inset-0 h-40 flex items-center justify-center">
											<button
											onClick={() => handleOpenModal(video.url)}
											className=" bg-black rounded-full p-2"
											>
												<BsPlay size={20} className="text-white"/>
											</button>
										</div>
										</div>
										<div className="mt-2 text-sm">
										<h3 className="">{video.title}</h3>
										<p className="text-gray-500">{video.creator} - {video.duration}</p>
										</div>
									</div>
									))}
								</Slider>
								{isOpen && (
									<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
									<div className="bg-white rounded-lg shadow-lg p-4">
										<button onClick={handleCloseModal} className="absolute top-2 text-lg text-white p-4 right-2">
										&times;
										</button>
										<video
										className="w-full h-64"
										controls
										autoPlay
										src={currentVideo}
										/>
									</div>
									</div>
								)}
							</div>
						</div>
						<div className="my-6 border-t-[1px] pb-6 border-b-[1px] border-gray-300">
						<h3 className="text-lg font-semibold py-4 ">Product Description</h3>
						<p>
							{product&&product.description}
						</p>
						</div>
					</div>
					<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
					{TopBrandInfo.map((item, index) => (
						<div key={index} className="p-4 border rounded-lg bg-gray-100">
						<h4 className="font-bold">{item.title}</h4>
						<p className="text-gray-600">{item.description}</p>
						</div>
					))}
					</div>
				</div>
				<div className=" p-8">
					<div className="flex">
						<div className="w-2/6">
							<p className="text-xl  font-bold">Customer reviews</p>
							<div className="flex pt-4 gap-2">
								<div className="flex gap-1">
									<BsStarFill className="text-yellow-500"/>
									<BsStarFill className="text-yellow-500"/>
									<BsStarFill className="text-yellow-500"/>
									<BsStarFill className="text-yellow-500"/>
									<BsStarFill className="text-yellow-500"/>
								</div>
								<p className="text-sm">4.4 out of 5</p>
							</div>
							<p className="text-xs pb-4 text-gray-400">109 global ratings</p>
							<div className="flex flex-col w-64 gap-2 pr-6">
								<div className="flex text-xs  justify-between">
									<p>5 star</p>
									<div className="w-32 h-2 my-1 bg-gray-200 rounded-full">
										<div className="w-3/4 h-full rounded-full bg-yellow-500"></div>
									</div>
									<p>70%</p>
								</div>
								<div className="flex text-xs  justify-between">
									<p>4 star</p>
									<div className="w-32 h-2 my-1 bg-gray-200 rounded-full">
										<div className="w-1/4 h-full rounded-full bg-yellow-500"></div>
									</div>
									<p>20%</p>
								</div>
								<div className="flex text-xs  justify-between">
									<p>3 star</p>
									<div className="w-32 h-2 my-1 bg-gray-200 rounded-full">
										<div className="w-4 h-full rounded-full bg-yellow-500"></div>
									</div>
									<p>9%</p>
								</div>
								<div className="flex text-xs  justify-between">
									<p>2 star</p>
									<div className="w-32 h-2 my-1 bg-gray-200 rounded-full">
										<div className="w-3 h-full rounded-full bg-yellow-500"></div>
									</div>
									<p>5%</p>
								</div>
								<div className="flex text-xs  justify-between">
									<p>1 star</p>
									<div className="w-32 h-2 my-1 bg-gray-200 rounded-full">
										<div className="w-6 h-full rounded-full bg-yellow-500"></div>
									</div>
									<p>16%</p>
								</div>
							</div>
						</div>
						<div className="w-4/6">
							<div className="flex justify-between ">
								<p className="text-xl  font-bold">Reviews with images</p>
								<p className="text-sm underline cursor-pointer">See all</p>
							</div>
							<div className="flex space-x-4 overflow-x-auto mt-2">
								{CartItems?.map((img, index) => (
									<img key={index} src={img.image} alt={``} className="rounded-lg w-32 h-32 object-cover" />
								))}
							</div>
							<h3 className="text-xl font-semibold mt-8">Top reviews </h3>
							{reviews.map((review, index) => (

								<div key={review.id} className="border-b text-sm border-gray-200 py-4">
									<div className="flex items-center">
										<span className="font-semibold">{review.name}</span>
										{review.verified && <span className="ml-2 text-green-500">(Verified Purchase)</span>}
									</div>
									<div className="text-yellow-500">
										{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
									</div>
									<p className="text-gray-500">{review.date}</p>
									<p className="mt-1">{review.text}</p>
									<div className="flex items-center mt-2">
										<span className="text-gray-500">{review.helpfulCount} people found this helpful</span>
										<button className="ml-4 text-blue-600 hover:underline">Helpful</button>
										<button className="ml-2 text-blue-600 hover:underline">Report</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="p-8">
					<p className="text-xl font-bold">You may also like this</p>
					<div className="flex gap-4 w-full py-6 flex-wrap">
						{
							products?.map((item, index) => (
								<ProductCard
												
												id={item._id}
												image={item.images[0]}
												title={item.name}
												// price={item.priceBundles.price}
												// shipping={item.shippingPrice}
												// sold={item.itemSold}
												// status={item.status}
												// rate={item.rate}
												// stock="Almost Gone"
												user={item.farmer}
												onAddToCart={handleAddToCart}
											/>
							))
						}
					</div>
				</div>
				<Popup 
					message={popupMessage} 
					isVisible={popupVisible} 
					onClose={closePopup} 
				/>
				<LandingFooter/>
			</div>
		</div>

	)
}
