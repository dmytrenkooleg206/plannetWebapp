import Link from 'next/link';
import Image from 'next/image';
import { Tab, Disclosure } from '@headlessui/react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import GoodGuideImage from '../../public/assets/images/reference/good_guide.jpg';
import GoodTitleImage from '../../public/assets/images/reference/good_title.png';
import GoodPromptImage1 from '../../public/assets/images/reference/good_prompt1.png';
import GoodPromptImage2 from '../../public/assets/images/reference/good_prompt2.png';
import GoodPromptImage3 from '../../public/assets/images/reference/good_prompt3.png';
import GoodPromptPhotoImage1 from '../../public/assets/images/reference/good_photo_prompt1.jpg';
import GoodPromptPhotoImage2 from '../../public/assets/images/reference/good_photo_prompt2.jpg';
import GoodPromptPhotoImage3 from '../../public/assets/images/reference/good_photo_prompt3.jpg';
import GoodRecordImage from '../../public/assets/images/reference/good_recording.png';
import BadGuideImage from '../../public/assets/images/reference/bad_guide.jpg';
import BadTitleImage from '../../public/assets/images/reference/bad_title.png';
import BadPromptImage1 from '../../public/assets/images/reference/bad_prompt1.png';
import BadPromptImage2 from '../../public/assets/images/reference/bad_prompt2.png';
import BadPromptImage3 from '../../public/assets/images/reference/bad_prompt3.png';
import BadPhotoPromptImage1 from '../../public/assets/images/reference/bad_photo_prompt1.jpg';
import BadPhotoPromptImage2 from '../../public/assets/images/reference/bad_photo_prompt2.jpg';
import BadPhotoPromptImage3 from '../../public/assets/images/reference/bad_photo_prompt3.png';
import BadRecordImage from '../../public/assets/images/reference/bad_recording.png';
import SettingsImage from '../../public/assets/images/reference/settings.png';
import ParisImage from '../../public/assets/images/reference/paris.jpeg';
import BarcelonaImage from '../../public/assets/images/reference/barcelona.jpeg';
import LondonImage from '../../public/assets/images/reference/london.jpeg';
import MexicoImage from '../../public/assets/images/reference/mexico.jpeg';
import LuxuryImage from '../../public/assets/images/reference/luxury.jpg';
import ArtImage from '../../public/assets/images/reference/art.jpg';
import RomanticImage from '../../public/assets/images/reference/romantic.jpg';
import NightlifeImage from '../../public/assets/images/reference/nightlife.png';
import FunImage from '../../public/assets/images/reference/fun.png';
import FoodieImage from '../../public/assets/images/reference/foodie.jpg';
import BudgetImage from '../../public/assets/images/reference/budget.png';

import ChatParisImage from '../../public/assets/images/reference/chat_paris.jpg';
import ChatBarcelonaImage from '../../public/assets/images/reference/chat_barcelona.jpg';
import ChatLondonImage from '../../public/assets/images/reference/chat_london.jpg';
import ChatMexicoImage from '../../public/assets/images/reference/chat_mexico.jpg';

export default function Reference() {
  const guidelines = [
    {
      key: 'profile_photo',
      title: 'Profile Photo:',
      description:
        'This should show your face clearly, and have your city in the background.',
      goodPhotos: [{ src: GoodGuideImage, key: 'good_guide' }],
      badPhotos: [{ src: BadGuideImage, key: 'bad_guide' }],
    },
    {
      key: 'title',
      title: 'Title:',
      description:
        'This should be a short sentence or phrase about the types of trips you will help travelers with.',
      goodPhotos: [{ src: GoodTitleImage, key: 'good_title' }],
      badPhotos: [{ src: BadTitleImage, key: 'bad_title' }],
    },
    {
      key: 'prompts',
      title: 'Written Prompts:',
      description:
        'This should be about 3 sentences long. The more information you provide to your travelers makes them more likely to book you!',
      goodPhotos: [
        {
          src: GoodPromptImage1,
          key: 'good_prompt1',
        },
        {
          src: GoodPromptImage2,
          key: 'good_prompt2',
        },
        {
          src: GoodPromptImage3,
          key: 'good_prompt3',
        },
      ],
      badPhotos: [
        { src: BadPromptImage1, key: 'bad_prompt1' },
        { src: BadPromptImage2, key: 'bad_prompt2' },
        { src: BadPromptImage3, key: 'bad_prompt3' },
      ],
    },
    {
      key: 'photo_prompts',
      title: 'Photo Prompts:',
      description:
        'This should be photos you have taken. They should be clear, and have minimal people in them.',
      goodPhotos: [
        {
          src: GoodPromptPhotoImage1,
          key: 'good_photo_prompt1',
        },
        {
          src: GoodPromptPhotoImage2,
          key: 'good_photo_prompt2',
        },
        {
          src: GoodPromptPhotoImage3,
          key: 'good_photo_prompt3',
        },
      ],
      badPhotos: [
        {
          src: BadPhotoPromptImage1,
          key: 'bad_photo_prompt1',
        },
        {
          src: BadPhotoPromptImage2,
          key: 'bad_photo_prompt2',
        },
        {
          src: BadPhotoPromptImage3,
          key: 'bad_photo_prompt3',
        },
      ],
    },
    {
      key: 'recording',
      title: 'Voice Recording:',
      description:
        'This should be a few sentences long, clear pronunciation, and have no background noise.',
      goodPhotos: [
        {
          src: GoodRecordImage,
          key: 'good_recording',
        },
      ],
      badPhotos: [
        {
          src: BadRecordImage,
          key: 'bad_recording',
        },
      ],
    },
  ];

  const itineraryTabs = [
    {
      tab: {
        location: 'Paris, France',
        description: 'Luxury, Arts & Culture, Romantic',
        image: ParisImage,
        key: 'paris',
      },
      content: {
        location: 'Paris, France',
        key: 'content_paris',
        types: [
          {
            text: 'Luxury',
            image: LuxuryImage,
            key: 'paris_luxury',
          },
          {
            text: 'Arts & Culture',
            image: ArtImage,
            key: 'paris_art',
          },
          {
            text: 'Romantic',
            image: RomanticImage,
            key: 'paris_romantic',
          },
        ],
        chatImage: ChatParisImage,
      },
    },
    {
      tab: {
        location: 'Barcelona, Spain',
        description: 'Nightlife, Hot Spots, Fun & Lively',
        image: BarcelonaImage,
        key: 'barcelona',
      },
      content: {
        location: 'Barcelona, Spain',
        key: 'content_barcelona',
        types: [
          {
            text: 'Nightlife',
            image: NightlifeImage,
            key: 'barcelona_nightlife',
          },
          {
            text: 'Hot Spots',
            image: ArtImage,
            key: 'barcelona_art',
          },
          {
            text: 'Fun & Lively',
            image: FunImage,
            key: 'barcelona_fun',
          },
        ],
        chatImage: ChatBarcelonaImage,
      },
    },
    {
      tab: {
        location: 'London, United Kingdom',
        description: 'Arts & Culture, Romantic, Foddie',
        image: LondonImage,
        key: 'london',
      },
      content: {
        location: 'London, United Kingdom',
        key: 'content_london',
        types: [
          {
            text: 'Art & Culture',
            image: ArtImage,
            key: 'london_art',
          },
          {
            text: 'Foodie',
            image: FoodieImage,
            key: 'london_foodie',
          },
          {
            text: 'Romantic',
            image: RomanticImage,
            key: 'london_romantic',
          },
        ],
        chatImage: ChatLondonImage,
      },
    },
    {
      tab: {
        location: 'Mexico City, Mexico',
        description: 'Budget Boutique, Foodie, Art & Culture',
        image: MexicoImage,
        key: 'mexico',
      },
      content: {
        location: 'Mexico City, Mexico',
        key: 'content_mexico',
        types: [
          {
            text: 'Budget',
            image: BudgetImage,
            key: 'mexico_budget',
          },
          {
            text: 'Foodie',
            image: FoodieImage,
            key: 'mexico_foodie',
          },
          {
            text: 'Art & Culture',
            image: ArtImage,
            key: 'mexico_art',
          },
        ],
        chatImage: ChatMexicoImage,
      },
    },
  ];

  const renderTab = (tabIndex: number) => {
    if (tabIndex === 1)
      return (
        <div className="max-w-6xl w-full flex flex-col mx-auto">
          <div className="text-4xl lg:text-7xl text-center font-bold mt-10 lg:mt-20 mb-5 lg:mb-10">
            What makes a great Planner Profile?
          </div>
          <div className="text-xl lg:text-3xl text-center text-white-700">
            A great Planner Profile goes beyond one word answers, and tells a
            story.
          </div>
          <div className="text-3xl lg:text-5xl font-bold mt-14 mb-5">
            Guidelines
          </div>

          {guidelines.map((guideline) => {
            const { key, title, description, goodPhotos, badPhotos } =
              guideline;
            return (
              <div className="bg-gray-158 p-5 lg:p-10 rounded mb-14" key={key}>
                <div className="text-black text-xl lg:text-3xl font-bold">
                  {title}
                </div>
                <div className="text-black text-xl lg:text-3xl mt-5 mb-10">
                  {description}
                </div>
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="w-full lg:w-[calc(50%-10px)] bg-white rounded p-5 lg:p-10">
                    <div className="flex justify-center mb-5">
                      <Image
                      loading="lazy"
                        src="/assets/images/reference/good.png"
                        alt="good"
                        width={40}
                        height={40}
                      />
                      <div className="text-4xl font-bold text-[#00ce3a] my-auto ml-2">
                        Good
                      </div>
                    </div>
                    {goodPhotos.map((photo) => {
                      return (
                        <Image
                        loading="lazy"
                          className="mb-5"
                          key={photo.key}
                          src={photo.src}
                          alt="good"
                        />
                      );
                    })}
                  </div>
                  <div className="w-full lg:w-[calc(50%-10px)] bg-white rounded p-5 lg:p-10">
                    <div className="flex justify-center mb-5">
                      <Image
                        src="/assets/images/reference/bad.png"
                        alt="bad"
                        width={40}
                        height={40}
                        loading="lazy"
                      />
                      <div className="text-4xl font-bold text-red my-auto ml-2">
                        bad
                      </div>
                    </div>
                    {badPhotos.map((photo) => {
                      return (
                        <Image
                        loading="lazy"
                          className="mb-5"
                          key={photo.key}
                          src={photo.src}
                          alt="bad"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    if (tabIndex === 2)
      return (
        <div className="mb-10">
          <div className="max-w-6xl w-full flex flex-col mx-auto">
            <div className="text-4xl lg:text-7xl text-center font-bold mt-10 lg:mt-20 mb-5 lg:mb-10">
              Example Trip Itineraries
            </div>
            <div className="text-xl lg:text-3xl text-center text-white-700">
              When completing your itinerary, please put the location in the
              title for each item so your travelers know where they are going!
              See some example itineraries below
            </div>
          </div>
          <div className="w-full">
            <Tab.Group>
              <div className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-[5px] after:bg-white-300 after:rounded ">
                <Tab.List className="pt-20 flex mx-auto w-fit">
                  {itineraryTabs.map((itinerary) => {
                    const { tab } = itinerary;
                    return (
                      <Tab
                        key={tab.key}
                        className="ui-selected:after:w-full ui-not-selected:after:w-[0px] after:h-[5px] after:bg-white after:rounded w-1/4 flex flex-col mx-2.5 ui-selected:focus:outline-none ui-not-selected:opacity-60 ui-selected:opacity-100 ui-not-selected:hover:opacity-80"
                      >
                        <div className="text-white">
                          <Image
                            className="max-w-[268px] w-full aspect-square rounded-lg"
                            src={tab.image}
                            alt={tab.key}
                            loading="lazy"
                          />
                          <div className="text-lg lg:text-2xl text-left my-2.5">
                            {tab.location}
                          </div>
                          <div className="text-base lg:text-base text-left tracking-tighter pb-5">
                            {tab.description}
                          </div>
                        </div>
                        <div className="grow" />
                      </Tab>
                    );
                  })}
                </Tab.List>
              </div>
              <Tab.Panels className="">
                {itineraryTabs.map((itinerary) => {
                  const { content } = itinerary;
                  const { key, location, types, chatImage } = content;
                  return (
                    <Tab.Panel
                      key={key}
                      className="text-black max-w-6xl w-full flex flex-col mx-auto bg-white py-10 lg:py-20 rounded-xl mt-10"
                    >
                      <div className="text-3xl lg:text-5xl text-center">
                        {location}
                      </div>
                      <div className="border-b-2 border-black-100">
                        <div className="flex mx-2 lg:mx-20 justify-between">
                          {types.map((type) => {
                            return (
                              <div
                                className="mx-1 my-5 lg:my-10 relative before:absolute before:bg-black-400 before:w-full before:h-full"
                                key={type.key}
                              >
                                <Image
                                  className="flex mx-auto max-w-[300px] w-full object-cover"
                                  src={type.image}
                                  alt={type.key}
                                  loading="lazy"
                                />
                                <div className="text-center translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 w-fit absolute text-[14px] lg:text-2xl text-white">
                                  {type.text}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mx-2 lg:mx-20 flex justify-between mt-10">
                        <div className="w-[calc(50%-10px)]">
                          <div className="rounded-2xl border-[24px] border-black h-full" />
                        </div>
                        <div className="w-[calc(50%-10px)]">
                          <div className="rounded-2xl border-[24px] border-black">
                            <Image src={chatImage} alt="chat" loading="lazy"/>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                  );
                })}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      );
    return (
      <div className="max-w-6xl w-full flex flex-col mx-auto mb-10">
        <div className="text-4xl lg:text-7xl text-center font-bold mt-10 lg:mt-20 mb-5 lg:mb-10">
          Planner Settings
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="mx-auto lg:min-w-[400px]">
            <Image src={SettingsImage} alt="settings" loading="lazy"/>
          </div>
          <div className="ml-0 lg:ml-20">
            <div className="text-3xl lg:text-5xl font-bold mt-10">
              Direct Messaging
            </div>
            <div className="text-2xl lg:text-4xl my-5 lg:my-10">
              You can set whether or not you want to message with new travelers.
            </div>
            <div className="text-3xl lg:text-5xl font-bold mt-10">
              Plannet Match
            </div>
            <div className="text-2xl lg:text-4xl my-5 lg:my-10">
              You can set whether or not you want to be automatically matched
              with travelers by Plannet. By turning this on, you are also
              eligible to be selected as a Planner that Plannet provides
              travelers for first time hotel bookings.
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col h-screen relative">
      <div className="absolute bg-primary w-full h-[800px] bg-cover bg-[url('/assets/images/landingpage/landing_page.png')]" />
      <main className="grow text-white z-10 bg-gradient-to-b from-black-400 from-[100px] via-black via-[400px] to-black">
        <Header isDark />
        <div className="max-w-6xl w-full flex flex-col mx-auto py-10 px-5">
          <div className="text-2xl">
            <Link href="/">Home</Link> /{' '}
            <span className="text-white-700">Planner Reference Sheet</span>
          </div>
          <div className="text-4xl lg:text-7xl text-left lg:text-center font-bold my-10 lg:my-20">
            Planner Reference Sheet
          </div>
        </div>
        <div className="hidden lg:block">
          <Tab.Group>
            <Tab.List className="w-fit bg-white mx-auto py-5 px-10 rounded-lg">
              <Tab className="text-xl ui-selected:bg-black ui-selected:focus:outline-none text-black-700 ui-selected:text-white mr-8 px-4 py-2 rounded-lg">
                Planner Profile
              </Tab>
              {/* <Tab className="text-xl ui-selected:bg-black ui-selected:focus:outline-none text-black-700 ui-selected:text-white mr-8 px-4 py-2 rounded-lg">
                Itineraries
              </Tab> */}
              <Tab className="text-xl ui-selected:bg-black ui-selected:focus:outline-none text-black-700 ui-selected:text-white mr-8 px-4 py-2 rounded-lg">
                Planner Settings
              </Tab>
            </Tab.List>
            <Tab.Panels className="">
              <Tab.Panel className="mx-5">{renderTab(1)}</Tab.Panel>
              {/* <Tab.Panel>{renderTab(2)}</Tab.Panel> */}
              <Tab.Panel>{renderTab(3)}</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
        <div className="block lg:hidden">
          <Disclosure>
            <Disclosure.Button className="text-xl p-2 mx-5 border-t border-white-300 w-[calc(100%-40px)]">
              {({ open }) => (
                <div className="flex justify-between">
                  <div>Planner Profile</div>
                  {!open ? <FaChevronDown /> : <FaChevronUp />}
                </div>
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="mx-5">{renderTab(1)}</Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button className="text-xl p-2 mx-5 border-t border-white-300 w-[calc(100%-40px)]">
              {({ open }) => (
                <div className="flex justify-between">
                  <div>Itineraries</div>
                  {!open ? <FaChevronDown /> : <FaChevronUp />}
                </div>
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="mx-5">{renderTab(2)}</Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button className="text-xl p-2 mx-5 border-t border-white-300 w-[calc(100%-40px)]">
              {({ open }) => (
                <div className="flex justify-between">
                  <div>Planner Settings</div>
                  {!open ? <FaChevronDown /> : <FaChevronUp />}
                </div>
              )}
            </Disclosure.Button>
            <Disclosure.Panel className="mx-5">{renderTab(3)}</Disclosure.Panel>
          </Disclosure>
        </div>
        <Footer />
      </main>
    </div>
  );
}
