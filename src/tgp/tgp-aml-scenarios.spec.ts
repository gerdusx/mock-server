import { TgpService } from './tgp.service';
import { DevService } from '../dev/dev.service';

const request = {
  date_of_birth: '1990-01-01',
  first_name: 'Demo',
  last_name: 'Person',
  gender: 'F' as const,
  country_code: 'ZAF' as const,
};

describe('TGP AML match scenarios', () => {
  const scenarios = [
    ['no_results', false, false, false],
    ['watchlist_match', true, false, false],
    ['pep_match', false, true, false],
    ['negative_media_match', false, false, true],
    ['match_found_compact', true, true, true],
  ] as const;

  it.each(scenarios)('%s returns only the selected match categories', (scenario, watchlist, pep, negativeMedia) => {
    const devService = {
      getMockConfig: () => ({ config: { identification: { anti_money_laundering_01: scenario } } }),
    } as unknown as DevService;
    const response = new TgpService(devService).antiMoneyLaundering(request);
    const attributes = response.Fields.Applicants_IO.Applicant[0].Attributes;
    const results = attributes.DSWatchlistVerification;

    expect(results.WlsResults.length > 0).toBe(watchlist);
    expect(results.PepResults.length > 0).toBe(pep);
    expect(results.NmResults.length > 0).toBe(negativeMedia);
    if (scenario !== 'match_found_compact') {
      expect(attributes.DRWatchlistVerification.MatchCount).toBe(
        results.WlsResults.length + results.PepResults.length + results.NmResults.length,
      );
    }
  });
});
