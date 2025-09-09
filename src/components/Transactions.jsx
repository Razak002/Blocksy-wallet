import dummyData from "../utils/dummyData"
import useFetch from "../hooks/useFetch"
import { shortenAddress } from "../utils/shortenAddress"


const TransactionCard = ({ addressTo, addressFrom, timestamp, message, amount, url }) => {

  const gifUrl = useFetch({ keyword: message })
  return (
    <div className="bg-[#181918] m-4 flex flex-1
  2xl:min-w-[450px]
  2xl:man-w-[500px]
  sm:min-w-[270px]
  sm:man-w-[300px]
  flex-col p-3 rounded-md hover:shadow-2xl
  ">
      <div className="flex flex-col items-center w-full mt-3">
        <div className="w-full mb-6 p-2">
          <a href={`https://ropsten.etherscan.io/address/${addressFrom}`} target="-blank" rel="noopener noreferrer">
            <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
          </a>
          <p className="text-white text-base">Amount: {amount}ETH</p>
          {message && (
            <>
              <br />
              <p className="text-white text-base">Message: {message} </p>
            </>
          )}
        </div>
        <img
          src={gifUrl || url}
          alt="gif"
          className="w-full h-64 2x:h-96 rounded-md shadow-lg object-cover"

        />
        <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#37c7da] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  )
}
const Transactions = () => {
  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        <h3 className="text-white text-3xl text-center my-2">Lattest Transaction Records</h3>
        <div className="flex flex-wrap justify-center items-center mt-10">
          {dummyData.reverse().map((transaction, i) => (
            <TransactionCard key={i} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Transactions
