import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';

import Button from '@/components/Button/Button';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { validateEmail } from '@/lib/utils';
import { completeSignUp, updateProfile } from '@/api/user/user.service';

import { createCity } from '@/api/city/city.service';

import { getLanguageSuggestions } from '@/api/language/language.service';
import { getPlannerSuggestions } from '@/api/plannerAndItineraryType/plannerAndItineraryType.service';
import { QUERY_OPTION } from '@/lib/constants';
import { FaChevronLeft } from 'react-icons/fa';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { actions } from '@/store/user/user.slice';
import {
  persistUserFullnameInLocalStorage,
  persistUserStatusInLocalStorage,
} from '@/lib/localStorage/localStorage';
import { plannetMonthlyTextSignUp } from '@/api/plannetMonthlyText/plannetMonthlyText.service';
import styles from './index.module.scss';
import City from './StepsPages/City';
import Travel from './StepsPages/Travel';
import Hotel from './StepsPages/Hotel';
import TravelWith from './StepsPages/TravelWith';
import NextTravel from './StepsPages/NextTravel';
import Age from './StepsPages/Age';
import Congrates from './Congrates';
// IMAGES
import Logo from '../images/logo.svg';
import {
  ageSuggests,
  hotelSuggestionItems,
  travelOptions,
  travelSuggestItems,
  travelWithSuggestItems,
  tripPeriods,
} from './suggestValues';

type PlannerSignupProps = {
  userId: string;
};
export default function PlannerSignup({ userId }: PlannerSignupProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [isFilledForm, setIsFilledForm] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isFormError, setIsFormError] = useState<boolean>(false);
  const [city, setCity] = useState<any>(null);
  const [cityId, setCityId] = useState<string | null>(null);
  const [selectedTravelId, setSelectedTravelId] = useState<number | null>(null);
  const [selectedTravelOptId, setSelectedTravelOptId] = useState<number | null>(
    null,
  );
  const [nextCities, setNextCities] = useState<string[]>([]);
  const [nextCitiesId, setNextCitiesId] = useState<string[]>([]);
  const [selectedTravelWithId, setSelectedTravelWithId] = useState<
    number | null
  >(null);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [selectedAgeId, setSelectedAgeId] = useState<number | null>(null);
  const [isSignUpDone, setIsSignUpDone] = useState<boolean>(false);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('isFormSubmitted') === 'true')
      setIsSubmitted(true);
  }, []);

  const isButtonDisabled = () => {
    if (progress === 0 && cityId) return false;
    if (progress === 1 && selectedTravelId !== null) return false;
    if (progress === 2 && selectedHotelId !== null) return false;
    if (progress === 3 && selectedTravelWithId !== null) return false;
    if (
      progress === 4 &&
      selectedTravelOptId !== null &&
      nextCities.length === 3
    )
      return false;
    if (progress === 5 && selectedAgeId !== null) return false;
    if (isFilledForm) return false;
    return true;
  };

  const handleCreateCity = async (place: any) => {
    if (isLoading) return;
    let placeId;
    let placeName;
    let country;

    if (place) {
      placeId = place.place_id;
      placeName = place.terms[0].value;
      country = place.terms[place.terms.length - 1].value;
    }
    setIsLoading(true);
    try {
      const { city } = await createCity({
        name: placeName,
        country,
        continent: '',
        placeId,
        longitude: '',
        latitude: '',
      });
      setCity(`${city?.name}, ${city?.country}`);
      setCityId(city?.id);
      if (progress === 4)
        setNextCitiesId((preState) => [...preState, city?.id]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTravelChange = (id: number) => {
    setSelectedTravelId(id);
  };

  const handleTravelWithChange = (id: number) => {
    setSelectedTravelWithId(id);
  };

  const handleHotelChange = (id: number) => {
    setSelectedHotelId(id);
  };

  const handleNextTravelOpt = (id: number) => {
    setSelectedTravelOptId(id);
  };

  const handleNextCitiesSel = (nextCity: any) => {
    handleCreateCity(nextCity);
    setNextCities((preState) => [...preState, nextCity.description]);
  };

  const handleDelNextCities = (city: string) => {
    // Find the index of the city in the nextCities array
    const index = nextCities.indexOf(city);

    // If the city is found, remove it from the array
    if (index !== -1) {
      const updatedCities = [...nextCities];
      updatedCities.splice(index, 1);
      setNextCities(updatedCities);
    }
  };

  const handleAgeChange = (id: number) => {
    setSelectedAgeId(id);
  };

  const handleContinue = async () => {
    if (isButtonDisabled()) return;

    setIsLoading(true);
    try {
      if (isFilledForm) {
        if (!validateEmail(email)) {
          setIsFormError(true);
        } else {
          if (firstName === '' || lastName === '') {
            return;
          }
          setIsLoading(true);
          try {
            const { user } = await completeSignUp({
              firstName,
              lastName,
              email,
            });
            dispatch(actions.setUser(user));
            persistUserFullnameInLocalStorage(
              `${user.firstName && user.firstName} ${
                user.lastName && user.lastName
              }`,
            );
            persistUserStatusInLocalStorage(user.status);
            setIsFormError(false);
            setIsSubmitted(true);
            localStorage.setItem('isFormSubmitted', 'true');
            setIsFilledForm(false);
          } catch (error) {
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        }
        return;
      }
      switch (progress) {
        case 0:
          await updateProfile({
            HomeBaseId: cityId,
            isBecomeAPlannerFlow: true,
          });
          setProgress(1);
          break;
        case 1:
          setProgress(2);
          break;
        case 2:
          setProgress(3);
          break;
        case 3:
          setProgress(4);
          break;
        case 4:
          setProgress(5);
          break;
        case 5:
          await plannetMonthlyTextSignUp({
            travelImportance: hotelSuggestionItems.find(
              (item) => item.id === selectedHotelId,
            )?.val,
            monthlyTravelStyle: travelSuggestItems.find(
              (item) => item.id === selectedTravelId,
            )?.val,
            travelingWith: travelWithSuggestItems.find(
              (item) => item.id === selectedTravelWithId,
            )?.val,
            travelDistance: '',
            priceRange: '',
            ageRange: ageSuggests.find((item) => item.id === selectedAgeId)
              ?.val,
            nextTripArea: travelOptions.find(
              (item) => item.id === selectedTravelOptId,
            )?.val,
            citiesWantToVisit: nextCitiesId,
            HomeBaseId: cityId,
            UserId: userId,
          });
          setIsSignUpDone(true);
          localStorage.setItem('isFormSubmitted', 'false');
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (firstName && lastName && email) setIsFilledForm(true);
    else setIsFilledForm(false);
  }, [firstName, lastName, email]);

  const handleGoBack = () => {
    if (progress) {
      setProgress(progress - 1);
    } else {
      router.push('/plannetMonthlyTexts');
    }
  };

  // eslint-disable-next-line consistent-return
  const renderStepContent = () => {
    switch (progress) {
      case 0:
        return <City city={city} handleCreateCity={handleCreateCity} />;
      case 1:
        return (
          <Travel
            handleChange={handleTravelChange}
            selectedID={selectedTravelId}
          />
        );
      case 2:
        return (
          <Hotel
            handleChange={handleHotelChange}
            selectedID={selectedHotelId}
          />
        );
      case 3:
        return (
          <TravelWith
            handleChange={handleTravelWithChange}
            selectedID={selectedTravelWithId}
          />
        );
      case 4:
        return (
          <NextTravel
            handleChange={handleNextTravelOpt}
            selectedID={selectedTravelOptId}
            handleCitiesSel={handleNextCitiesSel}
            cities={nextCities}
            handleCitiesDel={handleDelNextCities}
          />
        );
      case 5:
        return (
          <Age handleChange={handleAgeChange} selectedID={selectedAgeId} />
        );
      default:
        return <h1>Content</h1>;
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Link href="/" className={styles.logo}>
          <Image src={Logo} alt="plannet" priority />
        </Link>
        {isSignUpDone ? (
          <Congrates />
        ) : (
          <>
            <div className={styles.form}>
              <div className={styles.header}>
                {!isSubmitted ? 'Sign Up' : 'Plannet Monthly Texts'}
                <div className={styles.arrowBack} onClick={handleGoBack}>
                  <FaChevronLeft />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <ProgressBar
                  size={!isSubmitted ? 2 : 6}
                  progress={!isSubmitted ? 1 : progress}
                />
                <div className={styles.innerContent}>
                  {!isSubmitted ? (
                    <form className="flex flex-col flex-1 gap-[25px]">
                      <div className="flex flex-col gap-[15px]">
                        <p className="m-0 text-white text-[30px] max-sm:text-[20px] font-[500]">
                          First Name
                        </p>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="John"
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full h-[60px] max-sm:h-[48px] p-[15px_25px] max-sm:text-[20px] rounded-[8px] bg-[#FFFFFF1A] placholder-[#FFFFFF99] text-white outline-none text-[24px]"
                        />
                      </div>
                      <div className="flex flex-col gap-[15px]">
                        <p className="m-0 text-white text-[30px] max-sm:text-[20px] font-[500]">
                          Last Name
                        </p>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Doe"
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full h-[60px] max-sm:h-[48px] p-[15px_25px] max-sm:text-[20px] rounded-[8px] bg-[#FFFFFF1A] placholder-[#FFFFFF99] text-white outline-none text-[24px]"
                        />
                      </div>
                      <div className="flex flex-col gap-[15px]">
                        <p className="m-0 text-white text-[30px] max-sm:text-[20px] font-[500]">
                          Email
                        </p>
                        <input
                          type="email"
                          name="firstName"
                          placeholder="Johndoe@gmail.com"
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full h-[60px] max-sm:h-[48px] p-[15px_25px] max-sm:text-[20px] rounded-[8px] bg-[#FFFFFF1A] placholder-[#FFFFFF99] text-white outline-none text-[24px] ${
                            isFormError
                              ? 'border border-[#F54040] border-2'
                              : 'border-none'
                          }`}
                        />
                        {isFormError && (
                          <span className="text-[#F54040] text-[17px] font-[400]">
                            Email not valid. Please include an ‘@’ in the email
                            address.
                          </span>
                        )}
                      </div>
                    </form>
                  ) : (
                    renderStepContent()
                  )}
                  <div className="max-sm:mb-[50px]">
                    <Button
                      text="Continue"
                      isDisabled={isButtonDisabled()}
                      isLoading={isLoading}
                      color="gray"
                      onClick={handleContinue}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
