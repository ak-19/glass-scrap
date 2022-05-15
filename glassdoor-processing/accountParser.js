import cheerio from 'cheerio';

export default class AccountParser {
    constructor(content) {
        this.content = content
    }

    getAccount() {
        const account = {};
        const $ = cheerio.load(this.content);
        account.name = $('.SectionHeaderStyles__name___saD9S').get()[0].children[0].data;
        account.profession = this.reduceBreaks($('.profileInfoStyle__default___3mWZn.profileInfoStyle__wrap___102WU').get()[0].children[0].data);
        account.place = this.reduceBreaks($('.profileInfoStyle__default___3mWZn.profileInfoStyle__wrap___102WU').get()[1].children[0].data);
        account.email = this.reduceBreaks($('.profileInfoStyle__default___3mWZn.profileInfoStyle__wrap___102WU').get()[2].children[0].data);
        account.description = this.reduceBreaks($('p[data-test="description"]').get()[0].children[0].data.trim())


        account.experience = []

        for (const e of $('li[type="experience"]')) {
            const experience = {}
            experience.title = this.reduceBreaks($(e).find('h3[data-test="title"]').get()[0].children[0].data.trim())
            experience.employer = this.reduceBreaks($(e).find('div[data-test="employer"]').get()[0].children[0].children[0].data.trim())
            experience.location = this.reduceBreaks($(e).find('label[data-test="location"]').get()[0].children[0].data.trim())
            experience.period = this.reduceBreaks($(e).find('div[data-test="employmentperiod"]').get()[0].children[0].data.trim())
            account.experience.push(experience)
        }

        return account;
    }

    reduceBreaks(s) {
        return s.trim().replace(/(\r\n|\n|\r)/gm, '')
    }
}

