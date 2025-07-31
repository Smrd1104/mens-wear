import BestSeller from '../components/BestSeller'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import NewsLetter from '../components/NewsLetter'
import OurPolicy from '../components/OurPolicy'
import Festive from '../components/Festive'

const Home = () => {
    return (
        <div className='mt-22'>
            <Hero />
            <LatestCollection />
            <BestSeller />
            <Festive />
            <OurPolicy />
            <NewsLetter />
        </div>
    )
}

export default Home