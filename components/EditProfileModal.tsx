import { COLORS } from '@/constants/theme';
import { styles } from '@/styles/profile.styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ScreenWrapper } from '@/components/ScreenWrapper';

interface ModalEditProfileProps {
  isEditModalVisible: boolean;
  setIsEditModalVisible: (visible: boolean) => void;
  editedProfile: {
    fullname: string;
    bio: string;
  };
  setEditedProfile: React.Dispatch<React.SetStateAction<{ fullname: string; bio: string }>>;
  handleSaveProfile: () => void;
}

export function ModalEditProfile({
  isEditModalVisible,
  setIsEditModalVisible,
  editedProfile,
  setEditedProfile,
  handleSaveProfile,
}: ModalEditProfileProps) {
  const isValid = editedProfile.fullname.trim().length > 0;

  return (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <ScreenWrapper>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modal}
          >
            <View style={styles.modal_content_container}>

              <View style={styles.header_modal}>
                <Text style={styles.header_text_modal}>Edit Profile</Text>
                <TouchableOpacity
                  onPress={() => setIsEditModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close-sharp" size={24} color={COLORS.grey} />
                </TouchableOpacity>
              </View>

              <View style={styles.box_modal}>
                <Text style={styles.text_box_modal}>Full Name</Text>
                <TextInput
                  value={editedProfile.fullname}
                  onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, fullname: text }))}
                  style={styles.textinput_box_modal}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.grey || '#ccc'}
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={30}
                />
              </View>

              <View style={styles.box_modal}>
                <Text style={styles.text_box_modal}>Bio</Text>
                <TextInput
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, bio: text }))}
                  style={[styles.textinput_box_modal, { height: 100, textAlignVertical: 'top', paddingTop: 10 }]}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={COLORS.grey || '#ccc'}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={150}
                  blurOnSubmit={true}
                />
                <Text style={{ alignSelf: 'flex-end', color: COLORS.grey, fontSize: 10, marginTop: 4 }}>
                  {editedProfile.bio.length}/150
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSaveProfile}
                style={[
                  styles.button_modal,
                  !isValid && { opacity: 0.5 }
                ]}
                disabled={!isValid}
              >
                <Text style={styles.button_text_modal}>Save all</Text>
              </TouchableOpacity>

            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

      </ScreenWrapper>
    </Modal>
  );
}