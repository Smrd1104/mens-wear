import BestSeller from '../components/BestSeller'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import NewsLetter from '../components/NewsLetter'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
    return (
        <div>
            <Hero />
            <LatestCollection />
            <BestSeller />
            <OurPolicy />
            <NewsLetter />
        </div>
    )
}

export default Home