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
  return (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modal}>
            <View style={styles.header_modal}>
                <Text style={styles.header_text_modal}>Change info</Text>
                <TouchableOpacity onPress={()=>setIsEditModalVisible(false)}>
                    <Ionicons name="close-sharp" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            <View style={styles.box_modal}>
                <Text style={styles.text_box_modal}>Input name</Text>
                <TextInput value={editedProfile.fullname} onChangeText={(text)=>setEditedProfile((prev) => ({ ...prev, fullname: text }))} style={styles.textinput_box_modal}></TextInput>
            </View>
            <View style={styles.box_modal}>
                <Text style={styles.text_box_modal}>Input bio</Text>
                <TextInput value={editedProfile.bio} onChangeText={(text)=>setEditedProfile((prev) => ({ ...prev, bio: text }))} style={styles.textinput_box_modal}></TextInput>
            </View>
            <TouchableOpacity onPress={handleSaveProfile} style={styles.button_modal}><Text style={styles.button_text_modal}>Safe all</Text></TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
