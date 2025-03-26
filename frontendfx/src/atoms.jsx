import { atom, DefaultValue } from 'recoil';

// Persistence effect
const localPersistEffect = ({ onSet, setSelf, node }) => {
  const storedValue = localStorage.getItem(node.key);
  if (storedValue != null) {
    setSelf(JSON.parse(storedValue));
  }

  onSet((newValue) => {
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(node.key);
    } else {
      localStorage.setItem(node.key, JSON.stringify(newValue));
    }
  });
};

// Keeping exact same atom names and structure
export const userStates = atom({
  key: 'userState',
  default: {
    userId: null,
    username: null,
    lastame: null,
    midlename: null,
    email: null,
    phoneNumber: null,
    role: null,
    group: null,
    token: null,
    isEmailVerified: null,
    bloodGroup: null,
    address: null,
    dateOfBirth: null,
    gender: null,
    emergencyContact: null,
    nrc_card_id: null
  },
  effects: [localPersistEffect]
});

export const authState = atom({
  key: 'authState',
  default: false,
  effects: [localPersistEffect]
});