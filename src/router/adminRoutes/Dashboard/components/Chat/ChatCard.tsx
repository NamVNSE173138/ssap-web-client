import { Link } from 'react-router-dom';
import UserTwo from '../../images/user/user-02.png';
import { useEffect, useState } from 'react';
import { getAllAccounts } from '@/services/ApiServices/accountService';

/*const chatData: Chat[] = [
  {
    avatar: UserOne,
    name: 'Devid Heilo',
    text: 'How are you?',
    time: 12,
    textCount: 3,
    color: '#10B981',
  },
  {
    avatar: UserTwo,
    name: 'Henry Fisher',
    text: 'Waiting for you!',
    time: 12,
    textCount: 0,
    color: '#DC3545',
  },
  {
    avatar: UserFour,
    name: 'Jhon Doe',
    text: "What's up?",
    time: 32,
    textCount: 0,
    color: '#10B981',
  },
  {
    avatar: UserFive,
    name: 'Jane Doe',
    text: 'Great',
    time: 32,
    textCount: 2,
    color: '#FFBA00',
  },
  {
    avatar: UserOne,
    name: 'Jhon Doe',
    text: 'How are you?',
    time: 32,
    textCount: 0,
    color: '#10B981',
  },
  {
    avatar: UserThree,
    name: 'Jhon Doe',
    text: 'How are you?',
    time: 32,
    textCount: 3,
    color: '#FFBA00',
  },
];*/

const ChatCard = () => {
    const [providers, setProviders] = useState<any>(null);
    const [_error, setError] = useState<string>("");
    const [_loading, setLoading] = useState<boolean>(false);

  const fetchProviders = async () => {
    try {
      const response = await getAllAccounts();
      setProviders(response.filter((provider: any) => provider.roleName == "Provider"));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Service Providers
      </h4>

      <div>
        {providers && providers.map((chat:any, key:number) => (
        <div className='flex gap-2 ml-5 items-center'>
          <div>{chat.id}</div>
          <Link
            to="#"
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <img className="relative h-14 w-14 rounded-full" src={chat.avatarUrl} alt="User" />
              <span
                className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white"
                style={{backgroundColor: "green"}}
              ></span>
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.username}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {chat.email}
                  </span>
                  {/*<span className="text-xs"> . {chat.time} min</span>*/}
                </p>
              </div>
              {/*chat.textCount !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {' '}
                    {chat.textCount}
                  </span>
                </div>
              )*/}
            </div>
          </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
