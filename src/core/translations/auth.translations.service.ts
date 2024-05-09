import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthTranslationsService {
	signIn({ lang }) {
		let text = 'User signed in successfully'
		const code = 'user_signed_in_successfully'

		switch (lang) {
			case 'fr':
				text = 'Utilisateur est connecté avec success'
				break
		}
		return { text, code }
	}
}
