import {Controller} from '@nestjs/common';
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ProfileService} from "./profile.service";
import {MessagePattern, Payload} from "@nestjs/microservices";

@Controller('profile')
export class ProfileController {

    constructor(
        private profileService: ProfileService,
        ) {}

    @MessagePattern( { cmd: 'create_profile' } )
    createProfile(@Payload() profileDto: CreateProfileDto) {
        return this.profileService.create(profileDto);
    }

    @MessagePattern( { cmd: 'get_profiles' } )
    getAll() {
        return this.profileService.getProfiles();
    }

    @MessagePattern( { cmd: 'get_profile_by_id' } )
    getOne(@Payload() userId: number) {
        return this.profileService.getOne(userId);
    }

    @MessagePattern( { cmd: 'update_profile' } )
    updateProfile(
        @Payload() data,
        ) {
        return this.profileService.update(data);
    }

    @MessagePattern( { cmd: 'delete_profile' } )
    deleteProfile(@Payload() profileId) {
        return this.profileService.deleteProfile(profileId);
    }
}
