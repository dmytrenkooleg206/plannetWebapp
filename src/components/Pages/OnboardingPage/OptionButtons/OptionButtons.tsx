import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@/components/Button/Button';
import IconButton from '@/components/IconButton/IconButton';
import NumberSlider from '@/components/NumberSlider/NumberSlider';

import { actions } from '@/store/onboarding/onboarding.slice';

import styles from './OptionButtons.module.scss';

const travelStyleAnswers = [
  { key: 'party', value: 'life_of_the_party', text: 'Party', answerIndex: 0 },
  { key: 'romantic', value: 'hip_romantic', text: 'Romantic', answerIndex: 1 },
  { key: 'budget', value: 'budget', text: 'Budget', answerIndex: 2 },
  { key: 'culture', value: 'honors_biology', text: 'Culture', answerIndex: 3 },
  { key: 'relax', value: 'honors_biology', text: 'Relax', answerIndex: 4 },
  { key: 'no_preference', value: '', text: 'No preference', answerIndex: 5 },
];

const travelTypeAnswers = [
  {
    key: 'international',
    value: 'international',
    text: 'International',
    answerIndex: 0,
  },
  { key: 'domestic', value: 'domestic', text: 'Domestic', answerIndex: 1 },
];

const distancePreferenceAnswers = [
  {
    key: 'under_5_hours',
    value: 'under_5_hours',
    text: '5 hours max',
    answerIndex: 0,
  },
  {
    key: '5_to_10_hours',
    value: '5_to_10_hours',
    text: '10 hours max',
    answerIndex: 1,
  },
  {
    key: '10_plus_hours',
    value: '10_plus_hours',
    text: '10+ hours',
    answerIndex: 2,
  },
  {
    key: 'no_fly',
    value: '',
    text: `Don't want to fly`,
    answerIndex: 3,
  },
];
interface OptionButtonsProps {
  optionType: string;
  onUpdateChats: Function;
}

export default function OptionButtons({
  optionType,
  onUpdateChats,
}: OptionButtonsProps) {
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [color, setColor] = useState<any>();

  const dispatch = useDispatch();

  if (optionType === 'planning_trip')
    return (
      <div className={styles.block_button}>
        <div className={styles.content_button}>
          <Button
            text="Planning a trip"
            onClick={() => onUpdateChats('planning_trip', 0)}
          />
        </div>
        <div className={styles.content_button}>
          <Button
            text="Joining a trip"
            color="secondary"
            onClick={() => onUpdateChats('joinning_trip')}
          />
        </div>
      </div>
    );
  if (optionType === 'go_where')
    return (
      <div className={styles.block_button}>
        <div className={styles.content_button}>
          <Button
            text="Yes"
            size="20px"
            color="primary"
            isDisabled={false}
            isLoading={false}
            onClick={() => onUpdateChats('go_where', 0)}
          />
        </div>
        <div className={styles.content_button}>
          <Button
            text="Not Sure"
            size="20px"
            color="secondary"
            isDisabled={false}
            isLoading={false}
            onClick={() => onUpdateChats('go_where', 1)}
          />
        </div>
      </div>
    );
  if (optionType === 'no_trip_invite')
    return (
      <div className={styles.block_button}>
        <Button
          text="Planning a trip"
          onClick={() => onUpdateChats('planning_trip', 0)}
        />
      </div>
    );
  if (optionType === 'climate')
    return (
      <div>
        <div className={styles.block_icon_button}>
          <div className={styles.content_icon_button}>
            <IconButton
              onClick={() => {
                onUpdateChats('climate', 0);
                dispatch(actions.setClimate('HOT'));
              }}
              text="Hot"
              type="hot"
            />
          </div>
          <div className={styles.content_icon_button}>
            <IconButton
              onClick={() => {
                onUpdateChats('climate', 1);
                dispatch(actions.setClimate('COLD'));
              }}
              text="Cold"
              type="cold"
            />
          </div>
        </div>
        <div className={styles.block_button}>
          <Button
            text="No preference"
            color="black"
            onClick={() => onUpdateChats('climate', 2)}
          />
        </div>
      </div>
    );
  if (optionType === 'travel_style')
    return (
      <div className="flex flex-wrap justify-between my-5">
        {travelStyleAnswers.map((answer) => {
          return (
            <div className="w-[calc(50%-10px)] mb-4" key={answer.key}>
              <IconButton
                onClick={() => {
                  onUpdateChats('travel_style', answer.answerIndex);
                  dispatch(actions.setTravelStyle(answer.value));
                }}
                text={answer.text}
                type={answer.key}
              />
            </div>
          );
        })}
      </div>
    );
  if (optionType === 'travel_type')
    return (
      <div className="flex flex-wrap justify-between my-5">
        {travelTypeAnswers.map((answer) => {
          return (
            <div className="w-[calc(50%-10px)] mb-4" key={answer.key}>
              <IconButton
                onClick={() => {
                  onUpdateChats('travel_type', answer.answerIndex);
                  dispatch(actions.setTravelType(answer.value));
                }}
                text={answer.text}
                type={answer.key}
              />
            </div>
          );
        })}
      </div>
    );
  if (optionType === 'distance_preference')
    return (
      <div>
        {distancePreferenceAnswers.map((answer) => {
          return (
            <div className="my-2.5" key={answer.key}>
              <Button
                text={answer.text}
                color="secondary"
                onClick={() => {
                  onUpdateChats('distance_preference', answer.answerIndex);
                  dispatch(actions.setDistancePreference(answer.value));
                }}
              />
            </div>
          );
        })}
      </div>
    );
  if (optionType === 'go_when')
    return (
      <div className={styles.block_button}>
        <div className={styles.content_button}>
          <Button
            text="Yes"
            size="20px"
            color="primary"
            isDisabled={false}
            isLoading={false}
            onClick={() => onUpdateChats('go_when', 0)}
          />
        </div>
        <div className={styles.content_button}>
          <Button
            text="Not Sure"
            size="20px"
            color="secondary"
            isDisabled={false}
            isLoading={false}
            onClick={() => onUpdateChats('go_when', 1)}
          />
        </div>
      </div>
    );
  if (optionType === 'number_guests')
    return (
      <>
        <NumberSlider
          title="Adults"
          description="18+ years"
          value={adults}
          min={1}
          onChange={(val: number) => setAdults(val)}
        />
        <NumberSlider
          title="Kids"
          description="0-17 years"
          value={kids}
          onChange={(val: number) => setKids(val)}
        />
        <div className={styles.block_button}>
          <Button
            text="Continue"
            size="20px"
            isDisabled={!(adults || kids)}
            isLoading={false}
            onClick={() => {
              onUpdateChats(
                'number_guests',
                0,
                `Adults: ${adults}, kids: ${kids}`,
              );
              dispatch(actions.setNumAdults(adults));
              dispatch(actions.setNumKids(kids));
            }}
          />
        </div>
      </>
    );
  if (optionType === 'budget')
    return (
      <div>
        <div className={styles.block_button}>
          <div className={styles.content_button}>
            <Button
              text="< $2,000"
              color="secondary"
              onClick={(e: any) => {
                setColor('< $2,000');
                onUpdateChats('budget', 0);
                dispatch(actions.setBudgetThreshold('T_2K'));
              }}
            />
          </div>
          <div className={styles.content_button}>
            <Button
              text="$2,000-$3,000"
              color="secondary"
              onClick={() => {
                setColor('$2,000-$3,000');
                onUpdateChats('budget', 1);
                dispatch(actions.setBudgetThreshold('T_2K_3K'));
              }}
            />
          </div>
          <div className={styles.content_button}>
            <Button
              text="$3,000-$4,000"
              color="secondary"
              onClick={() => {
                setColor('$3,000-$4,000');
                onUpdateChats('budget', 2);
                dispatch(actions.setBudgetThreshold('T_3K_4K'));
              }}
            />
          </div>
          <div className={styles.content_button}>
            <Button
              text="< $4,000"
              color="secondary"
              onClick={() => {
                setColor('< $4,000');
                onUpdateChats('budget', 3);
                dispatch(actions.setBudgetThreshold('T_4K_PLUS'));
              }}
            />
          </div>
        </div>
        <Button
          text="Not Sure"
          color="secondary"
          onClick={() => {
            setColor('Not Sure');
            onUpdateChats('budget', 4);
            dispatch(actions.setBudgetThreshold('T_NOT_SURE'));
          }}
        />
      </div>
    );
  if (optionType === 'complete')
    return (
      <div>
        <div className={styles.block_button}>
          <div className={styles.content_button}>
            <Button
              text="< $2,000"
              color={color == '< $2,000' ? 'primary' : 'secondary'}
              onClick={() => {
                setColor("");
                setColor("< $2,000");
                onUpdateChats('budget', 0);
                dispatch(actions.setBudgetThreshold('T_2K'));
              }}
            />
          </div>
          <div className={styles.content_button}>
            <Button
              text="$2,000-$3,000"
              color={color == '$2,000-$3,000' ? 'primary' : 'secondary'}
              onClick={() => {
                setColor('$2,000-$3,000');
                onUpdateChats('budget', 1);
                dispatch(actions.setBudgetThreshold('T_2K_3K'));
              }}
            />
          </div>
          <div className={styles.content_button}>
            <Button
              text="$3,000-$4,000"
              color={color == '$3,000-$4,000' ? 'primary' : 'secondary'}
              onClick={() => {
                setColor('$3,000-$4,000');
                onUpdateChats('budget', 2);
                dispatch(actions.setBudgetThreshold('T_3K_4K'));
              }}
            />
          </div>
          <div className={styles.content_button}>
            <Button
              text="< $4,000"
              color={color == '< $4,000' ? 'primary' : 'secondary'}
              onClick={() => {
                setColor('< $4,000');
                onUpdateChats('budget', 3);
                dispatch(actions.setBudgetThreshold('T_4K_PLUS'));
              }}
            />
          </div>
        </div>
        <Button
          text="Not Sure"
          color={color == 'Not Sure' ? 'primary' : 'secondary'}
          onClick={() => {
            setColor("Not Sure");
            onUpdateChats('budget', 4);
            dispatch(actions.setBudgetThreshold('T_NOT_SURE'));
          }}
        />
      </div>
    );
  return null;
}
