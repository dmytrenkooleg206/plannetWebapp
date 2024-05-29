import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { actions as userActions, selectors } from '@/store/user/user.slice';
import {
  actions as onboardingActions,
  selectors as selector,
  actions,
} from '@/store/onboarding/onboarding.slice';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { CalendarModal } from '@/components/Modals/CalendarModal';
import { LearnMoreModal } from '@/components/Modals/LearnMoreModal';
import { DateHelperModal } from '@/components/Modals/DateHelperModal';
import { SelectLocationModal } from '@/components/Modals/SelectLocationModal';
import { getFormattedDate } from '@/lib/utils';
import { ONBOARDING_QUESTIONS } from '@/lib/constants';
import { getPlannetUserIdFromLocalStorage } from '@/lib/localStorage/localStorage';
import { getUserById } from '@/api/user/user.service';
import { DownloadModal } from '@/components/Modals/DownloadModal';
import Answer from './Answer/Answer';
import Question from './Question/Question';
import TripCard from './TripCard/TripCard';
import OptionButtons from './OptionButtons/OptionButtons';
import styles from './OnboardingPage.module.scss';
import CompleteButton from './CompleteButton';

export default function OnboardingPage() {
  const router = useRouter();

  const { isLoading, data: UserData } = useQuery(
    'current_user',
    () => getUserById(getPlannetUserIdFromLocalStorage()),
    {
      staleTime: 60000,
      cacheTime: 60000,
      retry: false,
      enabled: true,
    },
  );

  const dispatch = useDispatch();
  const currentUser = useSelector(selectors.user);

  const [currentQeustion, setCurrentQuestion] = useState<string>('Are you...');
  const [optionType, setOptionType] = useState<string>('planning_trip');
  const [chats, setChats] = useState<any[]>([]);
  const [showLMModal, setShowLMModal] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showCalendarModal, setShowCalendarModal] = useState<boolean>(false);
  const [showDatesHelperModal, setShowDatesHelperModal] =
    useState<boolean>(false);
  const [isEditDatesHelper, setIsEditDatesHelper] = useState<number>(0);
  const [isEditCalendar, setIsEditCalendar] = useState<number>(0);

  const [selectedCityKey, setSelectedCityKey] = useState<string>('');
  const [cityAnswerIndex, setCityAnswerIndex] = useState<number>(-1);
  const [selectedCities, setSelectedCities] = useState<any>([]);
  const [budget, setBudget] = useState<any>();

  const [showDownloadAppModal, setShowDownloadAppModal] =
    useState<boolean>(false);

  const onboarding = useSelector(selector.onboarding);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollToBottom = () => {
    // const target = document.getElementById('chat');
    const target = document.querySelector('#chatBox');
    if (target) {
      target?.scroll(0, target?.scrollHeight);
      // target.scrollIntoView(true);
    }
  };

  useEffect(() => {
    dispatch(onboardingActions.reset());
  }, []);

  useEffect(() => {
    if (chats.length) scrollToBottom();
  }, [chats]);

  useEffect(() => {
    if (!isLoading && UserData) {
      dispatch(userActions.setUser(UserData.user));
    }
    if (!isLoading && !UserData) router.push('/signin');
  }, [isLoading, UserData]);

  const getTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const mins = now.getMinutes();
    if (hour < 12) return `${hour}:${mins} AM`;
    if (hour === 12) return `${hour}:${mins} PM`;
    return `${hour - 12}:${mins} PM`;
  };

  const handleGoToQuestion = (questionType: string) => {
    setCurrentQuestion(ONBOARDING_QUESTIONS[questionType].question);
    setOptionType(questionType);

    if (questionType === 'complete') {
      // setShowDownloadAppModal(true);
      handleComplete();
    }
  };

  const updateChagnes = (
    selectedType: string,
    answerId: number,
    answerText?: string,
  ) => {

   

    if (selectedType === 'learn_more') {
      setShowLMModal(true);
      return;
    }
    if (selectedType === 'joinning_trip') {
      handleGoToQuestion('no_trip_invite');
      return;
    }
    if (selectedType === 'go_where' && answerId === 0) {
      setShowLocationModal(true);
      return;
    }
    if (selectedType === 'go_when') {
      if (answerId === 1) setShowDatesHelperModal(true);
      else setShowCalendarModal(true);
      return;
    }
    const tempChats = [...chats];
    const index = tempChats.findIndex(
      (chat) =>
        chat.key === `answer_${selectedType}_${answerId}` ||
        chat.key.includes('answer_budget'),
    );
    if (index >= 0) {
      tempChats[index].answerText =
        answerText || ONBOARDING_QUESTIONS[selectedType].answer[answerId];
    } else {
      tempChats.push({
        type: 'question',
        key: `question_${selectedType}_${answerId}`,
        questionType: ONBOARDING_QUESTIONS[selectedType].questionType,
        questionText: ONBOARDING_QUESTIONS[selectedType].question,
      });
      tempChats.push({
        type: 'answer',
        key: `answer_${selectedType}_${answerId}`,
        answerType: 'text',
        answerText:
          answerText || ONBOARDING_QUESTIONS[selectedType].answer[answerId],
        time: getTime(),
      });
    }
    const { nextQuestions } = ONBOARDING_QUESTIONS[selectedType];
    if (nextQuestions) {
      handleGoToQuestion(nextQuestions[answerId]);
    }
    setChats([...tempChats]);
  };

  const isShowChat = () => {
    if (optionType === 'joinning_trip') return false;
    return true;
  };

  const handleAddCity = (city: any, isUpdate: boolean) => {
    const cityItem = { ...city, key: Math.random().toString(16).slice(2) };
    const tempChats: any = [...chats];
    if (cityAnswerIndex >= 0) {
      const places = tempChats[cityAnswerIndex].cities;

      if (isUpdate) {
        const selectedIndex = places.findIndex(
          (item: any) => item.key === selectedCityKey,
        );
        const prevCity = places[selectedIndex];
        tempChats[cityAnswerIndex].cities[selectedIndex] = {
          ...cityItem,
          startDate: prevCity.startDate,
          endDate: prevCity.endDate,
          key: prevCity.key,
        };
        setSelectedCityKey('');
      } else {
        tempChats[cityAnswerIndex].cities = [
          ...tempChats[cityAnswerIndex].cities,
          cityItem,
        ];
      }
      setSelectedCities([...tempChats[cityAnswerIndex].cities]);
    } else {
      tempChats.push({
        type: 'question',
        key: `question_go_where`,
        questionType: ONBOARDING_QUESTIONS.go_where.questionType,
        questionText: ONBOARDING_QUESTIONS.go_where.question,
      });
      tempChats.push({
        type: 'answer',
        key: `answer_go_where_cities`,
        answerType: 'cities',
        cities: [cityItem],
        time: getTime(),
      });
      setOptionType('go_when');
      setCurrentQuestion(ONBOARDING_QUESTIONS.go_when.question);
      setCityAnswerIndex(tempChats.length - 1);
      setSelectedCities([cityItem]);
    }
    setChats([...tempChats]);
  };

  const handleChangeCity = (cityKey: string) => {
    setShowLocationModal(true);
    setSelectedCityKey(cityKey);
  };

  const handleDeleteCity = (cityKey: string) => {
    setSelectedCityKey(cityKey);
    setShowConfirmModal(true);
  };

  const handleRemoveCity = () => {
    const tempChats: any = [...chats];
    const index = tempChats.findIndex(
      (item: any) => item.type === 'answer' && item.answerType === 'cities',
    );
    if (index >= 0) {
      const selectedIndex = tempChats[index].cities.findIndex(
        (item: any) => item.key === selectedCityKey,
      );
      tempChats[index].cities.splice(selectedIndex, 1);
      setSelectedCities(tempChats[index].cities);
    }
    setSelectedCityKey('');
    setShowConfirmModal(false);
    setChats([...tempChats]);
  };

  const handleAddRange = (cityIndex: string, range: any) => {
    const tempChats: any[] = [...chats];
    if (cityAnswerIndex >= 0) {
      tempChats[cityAnswerIndex].cities[cityIndex].startDate = range.startDate;
      tempChats[cityAnswerIndex].cities[cityIndex].endDate = range.endDate;
    } else {
      tempChats.push({
        type: 'question',
        key: `question_go_when`,
        questionType: ONBOARDING_QUESTIONS.go_when.questionType,
        questionText: ONBOARDING_QUESTIONS.go_when.question,
      });
      tempChats.push({
        type: 'answer',
        key: `answer_go_where_when`,
        answerType: 'go_when',
        answerText: `${getFormattedDate(range.startDate)} - ${getFormattedDate(
          range.endDate,
        )}`,
        time: getTime(),
      });
      dispatch(
        onboardingActions.setTripStartDate(
          range.startDate.toISOString().split('T')[0],
        ),
      );
      dispatch(
        onboardingActions.setTripEndDate(
          range.endDate.toISOString().split('T')[0],
        ),
      );
    }
    setChats([...tempChats]);
  };

  const handleDateHelper = (month: any, nightDays: any) => {
    const tempChats = [...chats];
    tempChats.push({
      type: 'question',
      key: 'question_when_go_month',
      questionType: 2,
      questionText: 'Do you know when you want to go?',
    });
    tempChats.push({
      type: 'answer',
      key: 'answer_when_go_month',
      answerType: 'date_helper_month',
      answerText: month.label,
      time: getTime(),
    });
    tempChats.push({
      type: 'question',
      key: 'question_when_go_days',
      questionType: 2,
      questionText: 'Do you know when you want to go?',
    });
    tempChats.push({
      type: 'answer',
      key: 'answer_when_go_days',
      answerType: 'date_helper_days',
      answerText: nightDays.label,
      time: getTime(),
    });
    setChats([...tempChats]);
    setOptionType('number_guests');
    setCurrentQuestion(ONBOARDING_QUESTIONS.number_guests.question);
  };

  const handleEditDateHelper = (editType: string) => {
    if (editType === 'date_helper_month') setIsEditDatesHelper(1);
    else setIsEditDatesHelper(2);
    setShowDatesHelperModal(true);
  };

  const handleEditDateHelperComplete = (newData: any, type: number) => {
    let index = -1;
    const tempChats = [...chats];
    if (type === 0)
      index = tempChats.findIndex(
        (item: any) => item.answerType === 'date_helper_month',
      );
    else
      index = tempChats.findIndex(
        (item: any) => item.answerType === 'date_helper_days',
      );
    if (index >= 0) tempChats[index].answerText = newData.label;
    setChats([...tempChats]);
  };

  const handleUpdateRange = (range: any, selectedCityIndex: number) => {
    const tempChats = [...chats];
    if (selectedCityIndex >= 0) {
      tempChats[cityAnswerIndex].cities[selectedCityIndex].startDate =
        range.startDate;
      tempChats[cityAnswerIndex].cities[selectedCityIndex].endDate =
        range.endDate;
    } else {
      const index = tempChats.findIndex(
        (item: any) => item.answerType === 'go_when',
      );
      if (index >= 0) {
        tempChats[index].answerText = `${getFormattedDate(
          range.startDate,
        )} - ${getFormattedDate(range.endDate)}`;
        dispatch(
          onboardingActions.setTripStartDate(
            range.startDate.toISOString().split('T')[0],
          ),
        );
        dispatch(
          onboardingActions.setTripEndDate(
            range.endDate.toISOString().split('T')[0],
          ),
        );
      }
    }
    setChats([...tempChats]);
    setIsEditCalendar(0);
  };

  const handleComplete = async () => {
    const CityIds: any[] = [];
    const tripLegStartDates: any[] = [];
    const tripLegEndDates: any[] = [];
    let startDate: any = null;
    let endDate: any = null;

    for (let i = 0; i < selectedCities.length; i += 1) {
      CityIds.push(selectedCities[i].id);
      if (selectedCities[i].startDate) {
        tripLegStartDates.push(
          selectedCities[i].startDate.toISOString().split('T')[0],
        );
        tripLegEndDates.push(
          selectedCities[i].endDate.toISOString().split('T')[0],
        );
        if (
          !startDate ||
          startDate.getTime() > selectedCities[i].startDate.getTime()
        )
          startDate = selectedCities[i].startDate;
        if (!endDate || endDate.getTime() < selectedCities[i].endDate.getTime())
          endDate = selectedCities[i].endDate;
      }
    }

    const onboardingData: any = {
      ...onboarding,
      CityIds: [...CityIds],
    };

    onboardingData.CityIds = [...CityIds];
    onboardingData.tripLegStartDates = [...tripLegStartDates];
    onboardingData.tripLegEndDates = [...tripLegEndDates];
    if (!onboardingData.startDate && startDate)
      /* eslint-disable-next-line */
      onboardingData.startDate = startDate.toISOString().split('T')[0];
    if (!onboardingData.endDate && endDate)
      /* eslint-disable-next-line */
      onboardingData.endDate = endDate.toISOString().split('T')[0];
    if (!onboardingData.startDate || !onboardingData.CityIds.length) {
      onboardingData.tripLegStartDates = null;
      onboardingData.tripLegEndDates = null;
    }
    if (!onboardingData.CityIds.length) onboardingData.CityIds = null;
    if (!onboardingData.startDate) onboardingData.startDate = null;
    if (!onboardingData.endDate) onboardingData.endDate = null;

    // try {
    //   // setIsLoading(true);
    //   // const { trip } = await createTripWantsHelp(onboardingData);
    //   // dispatch(actions.reset());
    //   // onComplete();

    //   setShowDownloadAppModal(true);
    //   // router.push(`/trip/${trip.id}`);
    // } catch (err) {
    //   toast.error('Something went wrong!');
    //   // setIsLoading(false);
    // }
  };

  return (
    <>
      <div className={styles.onboarding}>
        <img
          className={styles.image_logo}
          src="/assets/images/onboarding/onboarding_logo.svg"
          alt=""
        />
        <div className={styles.text_hi}>
          Hi <span>{currentUser?.firstName}!</span>
        </div>
        <div className={styles.text_hi}>Welcome to Plannet.</div>
        {isShowChat() && (
          <div id="chatBox" className={styles.container_chat}>
            {chats.map((chat) => {
              if (chat.type === 'answer') {
                return (
                  <Answer
                    key={chat.key}
                    answer={chat}
                    onAddCity={() => setShowLocationModal(true)}
                    onChangeCity={handleChangeCity}
                    onDeleteCity={handleDeleteCity}
                    onEditDateHelper={handleEditDateHelper}
                    onEditRange={() => {
                      setShowCalendarModal(true);
                      setIsEditCalendar(1);
                    }}
                    onChangeDate={(cityKey: string) => {
                      setShowCalendarModal(true);
                      setIsEditCalendar(2);
                      setSelectedCityKey(cityKey);
                    }}
                    onGoToQuestion={handleGoToQuestion}
                  />
                );
              }
              return (
                <Question
                  key={chat.key}
                  questionType={chat?.questionType}
                  questionText={chat.questionText}
                />
              );
            })}
            {currentQeustion && (
              <div className={styles.current_question} id="chat">
                <img
                  className={styles.image_current_question}
                  src="/assets/images/onboarding/plannet_chat.svg"
                  alt=""
                />
                <div className={styles.text_current_question}>
                  {currentQeustion}
                </div>
              </div>
            )}
          </div>
        )}
        {optionType === 'joinning_trip' && <TripCard />}
        <OptionButtons optionType={optionType} onUpdateChats={updateChagnes} />
        {!showDownloadAppModal && (
          <div className="mt-2">
            <CompleteButton
              cities={selectedCities}
              optionType={optionType}
              setShowDownloadAppModal={setShowDownloadAppModal}
              // onComplete={() => setIsCompleted(true)}
            />
          </div>
        )}
        <LearnMoreModal
          isOpen={showLMModal}
          onClose={() => setShowLMModal(false)}
        />
        <SelectLocationModal
          isOpen={showLocationModal}
          onClose={() => {
            setShowLocationModal(false);
            if (selectedCityKey) setSelectedCityKey('');
          }}
          onAddCity={handleAddCity}
          isUpdate={!!selectedCityKey}
        />
        <ConfirmModal
          isOpen={showConfirmModal}
          onConfirm={() => handleRemoveCity()}
          onClose={() => {
            if (selectedCityKey) setSelectedCityKey('');
            setShowConfirmModal(false);
          }}
          text="Remove Destination?"
        />
        <DateHelperModal
          isOpen={showDatesHelperModal}
          setpIndex={isEditDatesHelper}
          onClose={() => {
            setIsEditDatesHelper(0);
            setShowDatesHelperModal(false);
          }}
          onComplete={handleDateHelper}
          onEdit={handleEditDateHelperComplete}
        />
        <CalendarModal
          isOpen={showCalendarModal}
          cities={selectedCities}
          onAddRange={handleAddRange}
          onClose={() => {
            setShowCalendarModal(false);
            if (isEditCalendar) setIsEditCalendar(0);
            if (selectedCityKey) setSelectedCityKey('');
          }}
          onGoToQuestion={handleGoToQuestion}
          modalType={isEditCalendar}
          onUpdateRange={handleUpdateRange}
          selectedCityKey={selectedCityKey}
        />
      </div>
      <DownloadModal
        isOpen={showDownloadAppModal}
        onClose={() => setShowDownloadAppModal(true)}
      />
    </>
  );
}
