import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import Autocomplete from 'react-google-autocomplete';
import Link from 'next/link';

import Button from '@/components/Button/Button';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { getContinent, isInvalidEmail } from '@/lib/utils';
import {
  updateEmail,
  updateFirstAndLastName,
  updateProfile,
  updateTours,
} from '@/api/user/user.service';

import { createCity, uploadCityPhoto } from '@/api/city/city.service';
import {
  createPlannerLanguage,
  deletePlannerLanguage,
} from '@/api/plannerLanguage/plannerLanguage.service';
import {
  createPlannerType,
  deletePlannerType,
} from '@/api/plannerType/plannerType.service';
import { getLanguageSuggestions } from '@/api/language/language.service';
import { getPlannerSuggestions } from '@/api/plannerAndItineraryType/plannerAndItineraryType.service';
import { QUERY_OPTION } from '@/lib/constants';
import { FaSearch, FaTimes } from 'react-icons/fa';

type PlannerSignupProps = {
  userId: string;
};
export default function PlannerSignup({ userId }: PlannerSignupProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [city, setCity] = useState<any>(null);
  const [cityId, setCityId] = useState<string | null>(null);
  const [bestInterests, setBestInterests] = useState<any[]>([]);
  const [suggestedInterests, setSuggestedInterests] = useState<any[]>([]);
  const [age, setAge] = useState<any>(null);
  const [tourDescriptions, setTourDescriptions] = useState<string>('');
  const [tourPrices, setTourPrices] = useState<string>('');
  const [bestLanguages, setBestLanguages] = useState<any[]>([]);
  const [suggestedLanguages, setSuggestedLanguages] = useState<any[]>([]);

  const ageSuggests = [
    { value: 'TWENTY_ONE_TO_TWENTY_SEVEN', range: '21-27' },
    { value: 'TWENTY_EIGHT_TO_THIRTY_FIVE', range: '28-35' },
    { value: 'THIRTY_FIVE_TO_FOURTY_FIVE', range: '35-45' },
    { value: 'FOURTY_FIVE_PLUS', range: '45+' },
  ];

  const { isSuccess: isSuccessPlanner, data: plannerSuggestionData } = useQuery(
    'planner_suggestions',
    getPlannerSuggestions,
    QUERY_OPTION,
  );

  const { isSuccess: isSuccessLanuage, data: languageSuggestionData } =
    useQuery('language_suggestions', getLanguageSuggestions, QUERY_OPTION);

  useEffect(() => {
    if (isSuccessPlanner && plannerSuggestionData) {
      setSuggestedInterests(plannerSuggestionData.suggestedList);
    }
  }, [isSuccessPlanner, plannerSuggestionData]);

  useEffect(() => {
    if (isSuccessLanuage && languageSuggestionData) {
      setSuggestedLanguages(languageSuggestionData.suggestedList);
    }
  }, [isSuccessLanuage, languageSuggestionData]);

  const isButtonDisabled = () => {
    if (progress === 0 && email && !isInvalidEmail(email)) return false;
    if (progress === 1 && firstName && lastName) return false;
    if (progress === 2 && cityId) return false;
    if (progress === 3 && bestInterests.length === 3) return false;
    if (progress === 4 && age) return false;
    if (progress === 6 && tourDescriptions && tourPrices) return false;
    if (progress === 7) return false;
    return true;
  };

  const handleContinue = async () => {
    if (isButtonDisabled()) return;

    setIsLoading(true);
    try {
      if (progress === 0) await updateEmail(email, userId);
      else if (progress === 1)
        await updateFirstAndLastName(firstName, lastName);
      else if (progress === 2)
        await updateProfile({
          HomeBaseId: cityId,
          isBecomeAPlannerFlow: true,
        });
      else if (progress === 4)
        await updateProfile({
          ageRange: age.value,
          isBecomeAPlannerFlow: true,
        });
      else if (progress === 6)
        await updateTours({
          isSellTours: true,
          tourDescriptions,
          tourPrices,
        });
      setProgress(progress + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInterest = async (interest: any, index: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const tempBestInterest = [...bestInterests];
      const tempInterests = [...suggestedInterests];
      const oldIndex = tempBestInterest.findIndex(
        (item) => item.id === interest.id,
      );
      if (!interest.selected && bestInterests.length < 3) {
        tempBestInterest.push(interest);
        console.log(interest.id, userId, interest.name, true);
        const { plannerType } = await createPlannerType({
          UserId: userId,
          name: interest.name,
          PlannerAndItineraryTypeId: interest.id,
          isBecomeAPlannerFlow: true,
        });

        tempInterests[index].selected = true;
        tempInterests[index].plannerTypeId = plannerType.id;
      } else if (oldIndex >= 0 && interest.selected) {
        await deletePlannerType(bestInterests[oldIndex].plannerTypeId);
        tempBestInterest.splice(oldIndex, 1);
        tempInterests[index].selected = false;
      } else return;
      setSuggestedInterests([...tempInterests]);
      setBestInterests([...tempBestInterest]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveInterest = async (interest: any, index: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await deletePlannerType(interest.plannerTypeId);
      const tempBestInterest = [...bestInterests];
      const tempInterests = [...suggestedInterests];

      const suggestedIndex = tempInterests.findIndex(
        (item) => item?.id === interest.id,
      );
      tempBestInterest.splice(index, 1);
      tempInterests[suggestedIndex].selected = false;

      setSuggestedInterests([...tempInterests]);
      setBestInterests([...tempBestInterest]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLanguage = async (language: any, index: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const tempBestLanguages = [...bestLanguages];
      const tempLanguages = [...suggestedLanguages];
      const oldIndex = tempBestLanguages.findIndex(
        (item) => item.id === language.id,
      );
      if (!language.selected && bestLanguages.length < 2) {
        tempBestLanguages.push(language);
        const { plannerLanguage } = await createPlannerLanguage({
          UserId: userId,
          name: language.name,
          isBecomeAPlannerFlow: true,
        });

        tempLanguages[index].selected = true;
        tempLanguages[index].plannerLanguageId = plannerLanguage.id;
      } else if (oldIndex >= 0 && language.selected) {
        await deletePlannerLanguage(
          tempBestLanguages[oldIndex].plannerLanguageId,
        );
        tempBestLanguages.splice(oldIndex, 1);
        tempLanguages[index].selected = false;
      } else return;
      setSuggestedLanguages([...tempLanguages]);
      setBestLanguages([...tempBestLanguages]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLanguage = async (language: any, index: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await deletePlannerType(language.plannerLanguageId);
      const tempBestLanguages = [...bestLanguages];
      const tempLanguages = [...suggestedLanguages];

      const suggestedIndex = tempLanguages.findIndex(
        (item) => item?.id === language.id,
      );
      tempBestLanguages.splice(index, 1);
      tempLanguages[suggestedIndex].selected = false;

      setSuggestedLanguages([...tempLanguages]);
      setBestLanguages([...tempBestLanguages]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellTours = async (isSellTours: boolean) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await updateTours({ isSellTours: true });
      if (isSellTours) setProgress(progress + 1);
      else setProgress(progress + 2);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCity = async (place: any) => {
    if (isLoading) return;
    let placeId;
    let placeName;
    let locality;
    let country;
    let continent;
    let longitude;
    let latitude;

    if (place) {
      placeId = place.place_id;
      longitude = place.geometry
        ? place.geometry.location.lng().toFixed(3)
        : '';
      latitude = place.geometry ? place.geometry.location.lat().toFixed(3) : '';

      if (place.address_components) {
        for (let i = 0; i < place.address_components.length; i += 1) {
          if (place.address_components[i].types[0] === 'country') {
            country = place.address_components[i].long_name;
            continent = getContinent(place.address_components[i].short_name);
          }

          if (
            place.address_components[i].types[0] === 'locality' ||
            place.address_components[i].types[1] === 'locality' ||
            place.address_components[i].types[2] === 'locality'
          ) {
            locality = place.address_components[i].long_name;
          }
        }
      }

      placeName = place.name ? place.name : locality;
    }
    setIsLoading(true);
    try {
      const { city } = await createCity({
        name: placeName,
        country,
        continent,
        placeId,
        longitude,
        latitude,
      });
      // if (!city.photoUrl_CF) {
      //   const { data } = await axios.get(
      //     `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP}`,
      //   );
      //   const {
      //     photo_reference: photoReference,
      //     height,
      //     width,
      //   } = data.result.photos[0];
      //   const photoRes = await axios.get(
      //     `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&sensor=false&maxheight=${height}&maxwidth=${width}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP}`,
      //     {
      //       responseType: 'blob',
      //     },
      //   );

      //   const formData = new FormData();
      //   formData.append('image', photoRes.data, 'image');
      //   formData.append('CityId', city.id);
      //   const { city: updatedCity } = await uploadCityPhoto(formData);
      //   city = { ...updatedCity };
      // }
      setCity(`${city?.name}, ${city?.country}`);
      setCityId(city?.id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCreateContent = () => {
    if (progress === 0)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold text-center">
            Enter your email address
          </div>
          <input
            type="text"
            className="px-4 py-3 text-lg md:text-2xl my-5 md:my-10 border border-black-100 w-full rounded outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@gmail.com"
          />
        </div>
      );
    if (progress === 1)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold text-center">
            Enter your first and last name
          </div>
          <input
            type="text"
            className="px-4 py-3 text-lg md:text-2xl mt-5 md:mt-10 border border-black-100 w-full rounded outline-none"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            className="px-4 py-3 text-lg md:text-2xl mt-5 mb-5 md:mb-10 border border-black-100 w-full rounded outline-none"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>
      );
    if (progress === 2)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold text-center">
            Enter your home base
          </div>
          <div className="text-xl text-black-600 text-center mt-2">
            This is the city you will be planning trips for.
          </div>
          <div className="relative">
            <Autocomplete
              // type="text"
              id="autocomplete"
              className="relative flex my-5 pl-12 pr-5 py-4 bg-white border border-black-300 rounded-lg text-2xl font-light w-full outline-none"
              placeholder="Search city"
              inputAutocompleteValue={city}
              defaultValue={city}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP}
              onPlaceSelected={(newPlace) => {
                handleCreateCity(newPlace);
              }}
            />
            <img
              className="absolute left-5 top-[21px]"
              src="/assets/images/registration/search.svg"
              alt="search"
            />
          </div>
        </div>
      );
    if (progress === 3)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold text-center">
            Add 3 Interest that best describe you.
          </div>
          <div className="my-5 md:my-10 flex flex-wrap bg-black-100 p-2">
            {bestInterests.map((interest, index: number) => {
              const { id, name } = interest;
              return (
                <button
                  type="button"
                  key={`best_interest_${id}`}
                  className="flex border border-black bg-black text-white px-4 py-2 rounded-lg mr-2 my-1"
                  onClick={() => handleRemoveInterest(interest, index)}
                >
                  <div>{name}</div>
                  <FaTimes className="my-auto ml-1" />
                </button>
              );
            })}
            {[...new Array(3 - bestInterests.length).keys()].map((index) => {
              return (
                <input
                  key={`progress_${index}`}
                  className="flex border border-dashed bg-white outline-none text-black px-4 py-2 rounded-lg mr-2 my-1 max-w-[120px]"
                  placeholder="Add interest"
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={(e) => setSearchText(e.target.value)}
                />
              );
            })}
          </div>
        </div>
      );
    if (progress === 4)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold text-center">
            Select your age range
          </div>
          <div className="flex justify-center my-5 md:my-10">
            {ageSuggests.map((suggest) => {
              return (
                <button
                  type="button"
                  key={suggest.range}
                  className={`border border-black rounded-lg py-1 px-3 mx-1 my-1 ${
                    age?.range === suggest.range ? 'text-white bg-black' : ''
                  }`}
                  onClick={() => setAge(suggest)}
                >
                  {suggest.range}
                </button>
              );
            })}
          </div>
        </div>
      );
    if (progress === 5)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold text-center">
            Are you interested in selling your own tours or experiences on
            Plannet
          </div>
          <div className="flex justify-between mt-10">
            <button
              type="button"
              onClick={() => handleSellTours(true)}
              className="text-xl border border-black rounded-lg w-[calc(50%-10px)] py-3 hover:bg-black hover:text-white duration-300"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleSellTours(false)}
              className="text-xl border border-black rounded-lg w-[calc(50%-10px)] py-3 hover:bg-black hover:text-white duration-300"
            >
              No
            </button>
          </div>
        </div>
      );
    if (progress === 6)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold">
            Describe the types of experiences and tours you would like to sell
            on Plannet
          </div>
          <textarea
            className="text-lg outline-none w-full border border-black-300 rounded-lg my-5 px-3 py-4 resize-none"
            placeholder="Describe your tours and experiences here..."
            onChange={(e) => setTourDescriptions(e.target.value)}
            value={tourDescriptions}
          />
          <div className="text-xl md:text-3xl font-bold">
            What price do you want to sell your tours/experiences at
          </div>
          <textarea
            className="text-lg outline-none w-full border border-black-300 rounded-lg my-5 px-3 py-4 resize-none"
            placeholder="Give a price range for your tours and experiences..."
            onChange={(e) => setTourPrices(e.target.value)}
            value={tourPrices}
          />
        </div>
      );
    if (progress === 7)
      return (
        <div>
          <div className="text-xl md:text-3xl font-bold text-center">
            Add up to 3 languages you can speak and write fluently.
          </div>
          <div className="my-5 md:my-10 flex flex-wrap bg-black-100 p-2">
            <div className="flex border border-black bg-black text-white px-4 py-2 rounded-lg mr-2 my-1">
              English
            </div>
            {bestLanguages.map((language, index: number) => {
              const { id, name } = language;
              return (
                <button
                  type="button"
                  key={`best_language_${id}`}
                  className="flex border border-black bg-black text-white px-4 py-2 rounded-lg mr-2 my-1"
                  onClick={() => handleRemoveLanguage(language, index)}
                >
                  <div>{name}</div>
                  <FaTimes className="my-auto ml-1" />
                </button>
              );
            })}
            {[...new Array(2 - bestLanguages.length).keys()].map((index) => {
              return (
                <input
                  key={`progress_${index}`}
                  className="flex border border-dashed bg-white outline-none text-black px-4 py-2 rounded-lg mr-2 my-1 max-w-[140px]"
                  placeholder="Add Language"
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={(e) => setSearchText(e.target.value)}
                />
              );
            })}
          </div>
        </div>
      );
    return null;
  };

  const renderExtraContent = () => {
    if (progress === 3)
      return (
        <div className="mt-5">
          <div className="text-xl font-bold text-black-400 mb-7">Suggested</div>
          <div className="flex flex-wrap">
            {suggestedInterests.map((interest, index) => {
              if (!interest) return null;
              const { id, name, selected } = interest;
              if (
                searchText &&
                !name.toLowerCase().includes(searchText.toLowerCase())
              )
                return null;
              return (
                <button
                  type="button"
                  key={`interest_${id}`}
                  className={`flex border border-black px-2 mb-2 mr-2 rounded-md ${
                    selected ? 'bg-black text-white' : ''
                  }`}
                  onClick={() => handleAddInterest(interest, index)}
                >
                  {name} +
                </button>
              );
            })}
          </div>
        </div>
      );
    if (progress === 7)
      return (
        <div className="mt-5">
          <div className="text-xl font-bold text-black-400 mb-7">Suggested</div>
          <div className="flex flex-wrap">
            {suggestedLanguages.map((language, index) => {
              if (!language) return null;
              const { id, name, selected } = language;
              if (
                searchText &&
                !name.toLowerCase().includes(searchText.toLowerCase())
              )
                return null;
              return (
                <button
                  type="button"
                  key={`interest_${id}`}
                  className={`flex border border-black px-2 mb-2 mr-2 rounded-md ${
                    selected || name === 'English' ? 'bg-black text-white' : ''
                  }`}
                  onClick={() => handleAddLanguage(language, index)}
                >
                  {name} {`${name === 'English' ? '' : '+'}`}
                </button>
              );
            })}
          </div>
        </div>
      );
    return null;
  };

  if (progress === 8)
    return (
      <div className="flex w-full bg-fill bg-no-repeat bg-center bg-[url('/assets/images/ourplanner/planner-bg-steps.png')]">
        <div className="w-full max-w-[500px] p-5 md:p-14 bg-white text-black mx-auto shadow-md mt-7 mb-20">
          <div className="text-2xl md:text-4xl font-bold text-center">
            Thank you for joining our waitlist!
          </div>
          <div className="text-lg md:text-2xl my-10 font-bold text-center">
            Download the Plannet app and complete your Planner profile
          </div>
          <div className="flex justify-center mt-4">
            <Link href={`${process.env.NEXT_PUBLIC_APP_STORE}`} target="blank">
              <img
                className="max-w-[190px] w-full h-full pr-2"
                src="/assets/images/landingpage/app_store.png"
                alt="app_store"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex w-full bg-fill bg-no-repeat bg-center bg-[#1F133E]">
      <div className="w-full max-w-[500px] py-5 bg-white text-black mx-auto shadow-md mt-0 md:mt-7 mb-20">
        <div className="border-b border-black-200 py-5 text-center text-xl md:text-3xl font-bold">
          Become a Planner
        </div>
        <div className="mx-5 md:mx-10 my-5">
          <ProgressBar size={6} progress={progress} />
          <div className="my-10">
            {renderCreateContent()}
            {progress !== 5 && (
              <Button
                text="Continue"
                isDisabled={isButtonDisabled()}
                isLoading={isLoading}
                color="black"
                onClick={handleContinue}
              />
            )}
            <div className="">{renderExtraContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
