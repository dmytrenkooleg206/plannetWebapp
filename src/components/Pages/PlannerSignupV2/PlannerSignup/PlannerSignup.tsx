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
import {
  createPlannerType,
  deletePlannerType,
} from '@/api/plannerType/plannerType.service';
import {
  createPlannerLanguage,
  deletePlannerLanguage,
} from '@/api/plannerLanguage/plannerLanguage.service';
import styles from './index.module.scss';
import City from './StepsPages/City';
import Age from './StepsPages/Age';
import Interest from './StepsPages/Interests';
import Congrates from './Congrates';
// IMAGES
import Logo from '../images/logo.svg';
import Languages from './StepsPages/Languages';
import { ageSuggests } from './suggestValues';

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
  const [selectedAgeId, setSelectedAgeId] = useState<number | null>(null);
  const [isSignUpDone, setIsSignUpDone] = useState<boolean>(false);
  const [suggestedInterests, setSuggestedInterests] = useState<any[]>([]);
  const [suggestedLanguages, setSuggestedLanguages] = useState<any[]>([]);
  const [bestInterests, setBestInterests] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>(['English']);

  const router = useRouter();

  const dispatch = useDispatch();

  const { isSuccess: isSuccessLanuage, data: languageSuggestionData } =
    useQuery('language_suggestions', getLanguageSuggestions, QUERY_OPTION);

  const { isSuccess: isSuccessPlanner, data: plannerSuggestionData } = useQuery(
    'planner_suggestions',
    getPlannerSuggestions,
    QUERY_OPTION,
  );

  useEffect(() => {
    if (isSuccessPlanner && plannerSuggestionData) {
      console.log('####', plannerSuggestionData);
      setSuggestedInterests(plannerSuggestionData.suggestedList);
    }
  }, [isSuccessPlanner, plannerSuggestionData]);

  useEffect(() => {
    if (isSuccessLanuage && languageSuggestionData) {
      setSuggestedLanguages(languageSuggestionData.suggestedList);
    }
  }, [isSuccessLanuage, languageSuggestionData]);

  useEffect(() => {
    if (localStorage.getItem('isFormSubmitted') === 'true')
      setIsSubmitted(true);
  }, []);

  const isButtonDisabled = () => {
    if (progress === 0 && cityId) return false;
    if (progress === 1 && selectedAgeId !== null) return false;
    if (progress === 2 && bestInterests.length === 3) return false;
    if (progress === 3 && languages !== null) return false;
    if (isFilledForm) return false;
    return true;
  };

  const handleAgeChange = (id: number) => {
    setSelectedAgeId(id);
  };

  const handleBestInterests = async (interest: any) => {
    try {
      await createPlannerType({
        UserId: userId,
        name: interest.name,
        PlannerAndItineraryTypeId: interest.id,
        isBecomeAPlannerFlow: true,
      });
      setBestInterests((preState) => [...preState, interest.name]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelBestInterests = async (interest: string) => {
    try {
      const filteredInterest = suggestedInterests.filter(
        (item) => item && item.name === interest,
      );
      await deletePlannerType(filteredInterest[0]?.id);
      // Find the index of the city in the nextCities array
      const index = bestInterests.indexOf(interest);

      // If the city is found, remove it from the array
      if (index !== -1) {
        const updatedInterests = [...bestInterests];
        updatedInterests.splice(index, 1);
        setBestInterests(updatedInterests);
      }

      if (isLoading) return;
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguages = async (language: string) => {
    try {
      const selectedLang = suggestedLanguages.filter(
        (item) => item && item.name === language,
      );
      await createPlannerLanguage({
        UserId: userId,
        name: selectedLang[0]?.name,
        isBecomeAPlannerFlow: true,
      });
      setLanguages((preState) => [...preState, language]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelLanguages = async (language: string) => {
    try {
      const selectedLang = suggestedLanguages.filter(
        (item) => item && item.name === language,
      );

      await deletePlannerLanguage(selectedLang[0]?.id);
      // Find the index of the city in the nextCities array
      const index = languages.indexOf(language);

      // If the city is found, remove it from the array
      if (index !== -1) {
        const updatedLanguages = [...languages];
        updatedLanguages.splice(index, 1);
        setLanguages(updatedLanguages);
      }
    } catch (error) {
      console.log(error);
    }
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
          await updateProfile({
            ageRange: ageSuggests.find((item) => item.id === selectedAgeId)
              ?.val,
            isBecomeAPlannerFlow: true,
          });
          setProgress(2);
          break;
        case 2:
          setProgress(3);
          break;
        case 3:
          setProgress(4);
          setIsSignUpDone(true);
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
      router.push('/planner');
    }
  };

  // eslint-disable-next-line consistent-return
  const renderStepContent = () => {
    switch (progress) {
      case 0:
        return <City city={city} handleCreateCity={handleCreateCity} />;
      case 1:
        return (
          <Age handleChange={handleAgeChange} selectedID={selectedAgeId} />
        );
      case 2:
        return (
          <Interest
            handleChange={handleBestInterests}
            handleDelInterests={handleDelBestInterests}
            selectedInterests={bestInterests}
            suggestedInterests={suggestedInterests}
          />
        );
      case 3:
        return (
          <Languages
            handleChange={handleLanguages}
            handleDelLanguages={handleDelLanguages}
            selectedLangs={languages}
            suggestedLanguages={suggestedLanguages}
          />
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
                {!isSubmitted ? 'Sign Up' : 'Become a Planner'}
                <div className={styles.arrowBack} onClick={handleGoBack}>
                  <FaChevronLeft />
                </div>
              </div>
              <div className="flex flex-col h-full">
                <ProgressBar
                  size={!isSubmitted ? 2 : 4}
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
